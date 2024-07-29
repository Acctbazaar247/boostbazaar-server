import {
  EApprovedForSale,
  EOrderStatus,
  Orders,
  Prisma,
  UserRole,
} from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { round } from 'lodash';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import sendEmail from '../../../helpers/sendEmail';
import sendNotification from '../../../helpers/sendNotification';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import EmailTemplates from '../../../shared/EmailTemplates';
import prisma from '../../../shared/prisma';
import { ordersSearchableFields } from './orders.constant';
import { IOrdersFilters } from './orders.interface';
const getAllOrders = async (
  filters: IOrdersFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Orders[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, sellerId, buyerEmail, sellerEmail, ...filterData } =
    filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = ordersSearchableFields.map(single => {
      const query = {
        [single]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      };
      return query;
    });
    andCondition.push({
      OR: searchAbleFields,
    });
  }
  if (Object.keys(filters).length) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  console.log({ sellerId, filters });
  if (sellerId) {
    const sellers: Prisma.OrdersWhereInput = {
      AND: {
        account: { ownById: sellerId },
      },
    };
    andCondition.push(sellers);
  }
  if (sellerEmail) {
    const sellers: Prisma.OrdersWhereInput = {
      AND: {
        account: { ownBy: { email: sellerEmail } },
      },
    };
    andCondition.push(sellers);
  }
  if (buyerEmail) {
    const sellers: Prisma.OrdersWhereInput = {
      AND: {
        orderBy: { email: buyerEmail },
      },
    };
    andCondition.push(sellers);
  }
  const whereConditions: Prisma.OrdersWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.orders.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    include: {
      account: {
        include: {
          Review: true,
          ownBy: {
            select: {
              name: true,
              id: true,
              email: true,
              profileImg: true,
            },
          },
        },
      },
      orderBy: {
        select: {
          profileImg: true,
          name: true,
          id: true,
          isVerifiedByAdmin: true,
          email: true,
        },
      },
    },
  });
  const total = await prisma.orders.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createOrders = async (payload: Orders): Promise<Orders | null> => {
  const isAccountExits = await prisma.account.findUnique({
    where: {
      id: payload.accountId,
      approvedForSale: EApprovedForSale.approved,
    },
  });

  if (!isAccountExits) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  // check user exits and dose user have enough currency to buy

  const isUserExist = await prisma.user.findUnique({
    where: { id: payload.orderById },
    select: {
      id: true,
      email: true,
      Currency: { select: { amount: true, id: true } },
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }

  //check buyer is not the the owner of this account

  if (isAccountExits.ownById === isUserExist.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Account owner can not buy their account !'
    );
  }
  // check is account already sold

  if (isAccountExits.isSold) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This account already sold');
  }
  // get seller info
  const isSellerExist = await prisma.user.findUnique({
    where: { id: isAccountExits.ownById },
    select: {
      id: true,
      email: true,
      role: true,
      isBlocked: true,
      Currency: { select: { amount: true, id: true } },
    },
  });

  if (isSellerExist?.isBlocked) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You can not buy this account! (Seller blocked.)'
    );
  }
  // the only 10 percent will receive by admin and expect the 10 percent seller will receive
  // get admin info
  const isAdminExist = await prisma.user.findFirst({
    where: { email: config.mainAdminEmail },
    select: {
      id: true,
      email: true,
      Currency: { select: { amount: true, id: true } },
    },
  });
  if (!isUserExist?.Currency?.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'something went wrong currency not found for this user!'
    );
  }
  const serviceCharge =
    (config.accountSellServiceCharge / 100) * isAccountExits.price;
  const amountToCutFromTheBuyer = serviceCharge + isAccountExits.price;

  if (amountToCutFromTheBuyer > isUserExist.Currency.amount) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Not enough currency left to by this account!'
    );
  }
  if (!isSellerExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }
  if (!isSellerExist?.Currency) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'something went wrong currency not found for this seller!'
    );
  }
  if (!isAdminExist?.id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
    // return
  }
  if (!isAdminExist.Currency?.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'something went wrong currency not found for this seller!'
    );
  }
  //
  const sellerFee = (config.accountSellPercentage / 100) * isAccountExits.price;
  const sellerReceive = isAccountExits.price - sellerFee;

  // const newAmountForAdmin =
  //   isSellerExist.role === UserRole.admin
  //     ? round(
  //         isAdminExist.Currency.amount + isAccountExits.price,
  //         config.calculationMoneyRound
  //       )
  //     : round(
  //         isAdminExist.Currency.amount + adminFee,
  //         config.calculationMoneyRound
  //       );
  const data = await prisma.$transaction(async tx => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const removeCurrencyFromUser = await tx.currency.update({
      where: { ownById: isUserExist.id },
      data: {
        amount: {
          decrement: round(
            amountToCutFromTheBuyer,
            config.calculationMoneyRound
          ),
        },
      },
    });
    if (removeCurrencyFromUser.amount < 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Something went wrong tray again latter '
      );
    }

    const isAdmin = isSellerExist.role === UserRole.admin;
    const isSuperAdmin = isSellerExist.role === UserRole.superAdmin;
    if (isAdmin || isSuperAdmin) {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const addCurrencyToAdmin = await tx.currency.update({
        where: { ownById: isAdminExist.id },
        data: {
          amount: {
            increment: round(
              isAccountExits.price + serviceCharge,
              config.calculationMoneyRound
            ),
          },
        },
      });
    } else {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const addCurrencyToSeller = await tx.currency.update({
        where: { ownById: isAccountExits.ownById },
        data: {
          amount: {
            increment: round(sellerReceive, config.calculationMoneyRound),
          },
        },
      });
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const addCurrencyToAdmin = await tx.currency.update({
        where: { ownById: isAdminExist.id },
        data: {
          amount: {
            increment: round(sellerFee + serviceCharge),
          },
        },
      });
    }
    //changer status of account is sold
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const update = await tx.account.update({
      where: { id: payload.accountId },
      data: { isSold: true },
    });
    const newOrders = await tx.orders.create({
      data: payload,
    });

    if (!newOrders) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'dffdfdf');
    }
    return newOrders;
  });
  await sendEmail(
    { to: isUserExist.email },
    {
      subject: EmailTemplates.orderSuccessful.subject,
      html: EmailTemplates.orderSuccessful.html({
        accountName: isAccountExits.name,
        accountPassword: isAccountExits.password,
        accountUserName: isAccountExits.username,
      }),
    }
  );
  await prisma.cart.deleteMany({
    where: {
      AND: [
        { accountId: isAccountExits.id },
        { ownById: isUserExist.id },
        // Add more conditions if needed
      ],
    },
  });
  await sendNotification({
    title: 'Order Completed',
    message: `You order for "${isAccountExits.name}" is Completed `,
    ownById: payload.orderById,
    link: `/order`,
  });
  return data;
};

const getSingleOrders = async (
  id: string,
  requestedUer: JwtPayload
): Promise<Orders | null> => {
  const result = await prisma.orders.findUnique({
    where: {
      id,
    },
    include: {
      account: {
        include: {
          ownBy: {
            select: {
              email: true,
              profileImg: true,
              name: true,
              id: true,
              isVerifiedByAdmin: true,
            },
          },
          Review: true,
        },
      },
      orderBy: {
        select: {
          profileImg: true,
          name: true,
          id: true,
          isVerifiedByAdmin: true,
        },
      },
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not founds!');
  }

  if (
    requestedUer.role === UserRole.seller ||
    requestedUer.role === UserRole.user
  ) {
    if (result.orderById !== requestedUer.userId) {
      if (requestedUer.userId !== result.account.ownById) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'You are not allowed to access this'
        );
      }
    }
  }
  return result;
};
const getMyOrders = async (id: string): Promise<Orders[] | null> => {
  const result = await prisma.orders.findMany({
    where: {
      orderById: id,
    },
    include: {
      account: {
        include: {
          ownBy: {
            select: {
              name: true,
              id: true,
              profileImg: true,
              email: true,
              role: true,
              isVerifiedByAdmin: true,
            },
          },
          Review: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const updateOrders = async (
  id: string,
  payload: Partial<Orders>
): Promise<Orders | null> => {
  const isOrderExits = await prisma.orders.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      orderBy: {
        select: {
          id: true,
        },
      },
      account: {
        select: {
          id: true,
          price: true,
          ownBy: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (
    !isOrderExits ||
    !isOrderExits.account ||
    !isOrderExits.account.ownBy ||
    !isOrderExits.orderBy
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'order not found!');
  }
  if (isOrderExits.status === EOrderStatus.cancelled) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'order already cancel');
  }

  // if want to make it canceled
  const isOrderCompleted = isOrderExits.status === EOrderStatus.completed;
  const wantToUpdateItCancel = payload.status === EOrderStatus.cancelled;
  if (isOrderCompleted && wantToUpdateItCancel) {
    // check doe
    // check does buyer has enough money left

    const buyerCurrency = await prisma.currency.findUnique({
      where: { ownById: isOrderExits.account.ownBy.id },
    });
    if (!buyerCurrency) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer currency not found!');
    }
    if (isOrderExits.account.price > buyerCurrency.amount) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Buyer does't have enough money left to return"
      );
    }
    const outPut = await prisma.$transaction(async tx => {
      // update seller amount
      const updatedAmount = await tx.currency.update({
        where: { ownById: isOrderExits.account.ownBy.id },
        data: { amount: { decrement: isOrderExits.account.price } },
      });
      if (0 > updatedAmount.amount) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Buyer does't have enough money left to return"
        );
      }

      //update buyer or who make this order
      await tx.currency.update({
        where: {
          ownById: isOrderExits.orderBy.id,
        },
        data: {
          amount: { increment: isOrderExits.account.price },
        },
      });

      return await tx.orders.update({
        where: {
          id,
        },
        data: payload,
      });
    });
    return outPut;
  }

  const result = await prisma.orders.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteOrders = async (id: string): Promise<Orders | null> => {
  const result = await prisma.orders.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Orders not found!');
  }
  return result;
};

export const OrdersService = {
  getAllOrders,
  createOrders,
  updateOrders,
  getSingleOrders,
  deleteOrders,
  getMyOrders,
};
