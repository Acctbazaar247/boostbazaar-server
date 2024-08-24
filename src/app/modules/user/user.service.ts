import { EOrderStatus, Prisma, User, UserRole } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import createBycryptPassword from '../../../helpers/createBycryptPassword';
import nowPaymentChecker from '../../../helpers/nowPaymentChecker';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse, TAdminOverview } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { userSearchableFields } from './user.constant';
import { IUserFilters } from './user.interface';

const getAllUser = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<
  IGenericResponse<
    Omit<User, 'password' | 'withdrawalPin' | 'failedLoginAttempt'>[]
  >
> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = userSearchableFields.map(single => {
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
          equals:
            key === 'isApprovedForSeller'
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                JSON.parse((filterData as any)[key])
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,

    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            id: 'desc',
          },
    select: {
      email: true,
      id: true,
      name: true,
      profileImg: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      isBlocked: true,
      shouldSendEmail: true,
      Currency: {
        select: {
          amount: true,
        },
      },
    },
  });
  const total = await prisma.user.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createUser = async (payload: Omit<User, 'id'>): Promise<User | null> => {
  const newUser = await prisma.user.create({
    data: payload,
  });
  return newUser;
};

const getSingleUser = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return result;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sellerIpn = async (data: any): Promise<void> => {
  if (data.payment_status !== 'finished') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Sorry payment is not finished yet '
    );
  }
  await nowPaymentChecker(data.payment_id);
  // const { order_id, payment_status, price_amount } = data;
  // await UpdateSellerAfterPay({
  //   order_id,
  //   payment_status,
  //   price_amount,
  // });
  // update user to vari
};

const updateUser = async (
  id: string,
  payload: Partial<User>,
  requestedUser: JwtPayload
): Promise<User | null> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { password, ...rest } = payload;
  let genarateBycryptPass;
  if (password) {
    genarateBycryptPass = await createBycryptPassword(password);
  }

  const isUserExist = await prisma.user.findUnique({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  const isRoleExits = rest.role;
  const isRoleNotMatch = isUserExist.role !== rest.role;
  const isRequestedUSerNotSuperAdmin = requestedUser.role !== UserRole.admin;

  if (isRoleExits && isRoleNotMatch && isRequestedUSerNotSuperAdmin) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User role can only be changed by super admin'
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: genarateBycryptPass
      ? { ...rest, password: genarateBycryptPass }
      : rest,
  });
  return result;
};

const deleteUser = async (id: string): Promise<User | null> => {
  return await prisma.$transaction(async tx => {
    const deleteUser = await tx.user.delete({ where: { id } });
    return deleteUser;
  });
};

const adminOverview = async (): Promise<TAdminOverview | null> => {
  const totalOrder = await prisma.orders.count({
    where: { status: EOrderStatus.completed },
  });
  const totalSale = await prisma.orders.aggregate({
    _sum: {
      charge: true,
    },
  });
  const startOfToday = startOfDay(new Date());
  const endOfToday = endOfDay(new Date());

  const totalTodaySale = await prisma.orders.aggregate({
    _sum: {
      charge: true,
    },
    where: {
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  const totalUser = await prisma.user.count();
  const countsByCategory = await prisma.orders.groupBy({
    by: ['accountCategory'],
    _count: {
      id: true,
    },
  });
  const trafic = countsByCategory.map(category => ({
    accountCategory: category.accountCategory,
    count: category._count.id,
  }));
  return {
    totalUser,
    totalOrder,
    totalSale: totalSale._sum.charge || 0,
    totalTodaySale: totalTodaySale._sum.charge || 0,
    trafic: trafic,
  };
};
const userSpend = async (
  payload: string
): Promise<{ spend: number } | null> => {
  const totalCharge = await prisma.orders.aggregate({
    _sum: {
      charge: true,
    },
    where: {
      orderById: payload, // Replace this with the actual ID you want to filter by
    },
  });
  console.log({ totalCharge });
  return {
    spend: totalCharge._sum.charge || 0,
  };
};
// const sellerOverview = async (id: string): Promise<TSellerOverview | null> => {
//   const totalAccount = await prisma.account.count({ where: { ownById: id } });
//   const totalAccountApprove = await prisma.account.count({
//     where: { ownById: id, approvedForSale: 'approved' },
//   });
//   const totalSoldAccount = await prisma.account.count({
//     where: { isSold: true, ownById: id },
//   });
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const currency = await prisma.currency.findUnique({
//     where: { ownById: id },
//   });
//   const totalMoney = currency?.amount || 0;
//   const totalWithdraw = await prisma.withdrawalRequest.aggregate({
//     where: {
//       status: 'approved',
//       ownById: id,
//     },
//     _sum: {
//       amount: true,
//     },
//   });
//   const totalFundWallet = await prisma.currencyRequest.aggregate({
//     where: {
//       status: 'approved',
//       ownById: id,
//     },
//     _sum: {
//       amount: true,
//     },
//   });
//   console.log(totalWithdraw);
//   const today = new Date();
//   const pastYearDate = new Date(
//     today.getFullYear() - 1,
//     today.getMonth(),
//     today.getDate()
//   );

//   const pastYearData = await prisma.account.findMany({
//     where: {
//       createdAt: {
//         gte: pastYearDate,
//         lte: today,
//       },
//       isSold: true,
//       ownById: id,
//     },
//     select: {
//       price: true,
//       Orders: {
//         select: {
//           createdAt: true,
//         },
//       },
//     },
//   });

//   return {
//     totalAccount,
//     totalSoldAccount,
//     totalOrder,
//     totalMoney,
//     totalWithdraw: totalWithdraw._sum.amount || 0,
//     totalAccountApprove,
//     totalFundWallet: totalFundWallet._sum.amount || 0,
//     pastYearData: pastYearData || [],
//   };
// };
// const sellerProfileInfo = async (
//   id: string
// ): Promise<TSellerProfileInfo | null> => {
//   const isSellerExist = await prisma.user.findUnique({
//     where: { id },
//     select: {
//       name: true,
//       id: true,
//       profileImg: true,
//       isVerifiedByAdmin: true,
//       country: true,
//       createdAt: true,
//     },
//   });
//   if (!isSellerExist) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Seller doesn't exist");
//   }
//   const totalAccountApprove = await prisma.account.count({
//     where: { ownById: id, approvedForSale: 'approved' },
//   });
//   const totalSoldAccount = await prisma.account.count({
//     where: { isSold: true, ownById: id },
//   });
//   const totalCancelOrder = await prisma.orders.count({
//     where: {
//       account: {
//         ownById: id,
//       },
//       status: EOrderStatus.cancelled,
//     },
//   });
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const totalReviews = await prisma.review.count({ where: { sellerId: id } });
//   const totalPositiveReviews = await prisma.review.count({
//     where: { sellerId: id, reviewStatus: EReviewStatus.positive },
//   });
//   const totalNegativeReviews = await prisma.review.count({
//     where: { sellerId: id, reviewStatus: EReviewStatus.negative },
//   });

//   return {
//     totalSoldAccount,
//     totalOrder,
//     totalAccountApprove,
//     totalCancelOrder: totalCancelOrder,
//     totalPositiveReviews,
//     totalNegativeReviews,
//     totalReviews,
//     sellerInfo: {
//       ...isSellerExist,
//     },
//   };
// };
// const userOverview = async (id: string): Promise<TUserOverview | null> => {
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const totalAccountOnCart = await prisma.cart.count({
//     where: { ownById: id },
//   });
//   // const totalOrder = await prisma.account.count({ where: { ownById: id } });
//   const currency = await prisma.currency.findUnique({
//     where: { ownById: id },
//   });
//   const totalMoney = currency?.amount || 0;
//   return {
//     totalOrder,
//     totalAccountOnCart,
//     totalMoney,
//   };
// };
const sendUserQuery = async (
  id: string,
  description: string,
  queryType: string
): Promise<void> => {
  const isUserExist = await prisma.user.findUnique({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found!');
  }
  // const transport = await nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: config.emailUser,
  //     pass: config.emailUserPass,
  //   },
  // });
  const transport = await nodemailer.createTransport({
    host: 'mail.privateemail.com', // or 'smtp.privateemail.com'
    port: 465, // or 465 for SSL. or 587
    secure: true, // true for 465, false for 587
    auth: {
      user: config.emailUser,
      pass: config.emailUserPass,
    },
    tls: {
      // Enable TLS encryption
      ciphers: 'SSLv3',
    },
  });
  // send mail with defined transport object
  const mailOptions = {
    from: config.emailUser,
    to: config.emailUser,
    subject: `${isUserExist.name} asked a Query about ${queryType}`,
    text: `
    This query asked from ${isUserExist.email}

    The query:${description}
    `,
  };
  try {
    await transport.sendMail({ ...mailOptions });
    console.log(' success');
  } catch (err) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Sorry try again after some time'
    );
  }
};

export const UserService = {
  getAllUser,
  createUser,
  updateUser,
  getSingleUser,
  deleteUser,
  sendUserQuery,
  sellerIpn,
  adminOverview,
  userSpend,
};
