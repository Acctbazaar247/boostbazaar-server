import {
  ESmsPoolOrderStatus,
  Prisma,
  SmsPoolOrder,
  UserRole,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { smsPoolRequest } from '../../../helpers/smsPoolRequest';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { smsPoolOrderSearchableFields } from './smsPoolOrder.constant';
import {
  ISmsPoolOrderDetails,
  ISmsPoolOrderFilters,
} from './smsPoolOrder.interface';

const getAllSmsPoolOrder = async (
  filters: ISmsPoolOrderFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<SmsPoolOrder[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = smsPoolOrderSearchableFields.map(single => {
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
      AND: Object.entries(filterData).map(([field, value]) => {
        // Check if the value is a string "true" or "false"
        if (value === 'true' || value === 'false') {
          return { [field]: JSON.parse(value) };
        }
        return { [field]: value };
      }),
    });
  }

  const whereConditions: Prisma.SmsPoolOrderWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.smsPoolOrder.findMany({
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
      orderBy: {
        select: {
          email: true,
          name: true,
          id: true,
          profileImg: true,
        },
      },
    },
  });
  const total = await prisma.smsPoolOrder.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createSmsPoolOrder = async (
  payload: SmsPoolOrder
): Promise<SmsPoolOrder | null> => {
  const newSmsPoolOrder = await prisma.smsPoolOrder.create({
    data: payload,
  });
  return newSmsPoolOrder;
};

const getSingleSmsPoolOrder = async (
  id: string
): Promise<ISmsPoolOrderDetails | null> => {
  const result = await prisma.smsPoolOrder.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Found');
  }
  // get details form smsPool
  const getOrderHistory = await smsPoolRequest.getAllOrderHistory({
    orderId: result.orderId,
  });
  if (!getOrderHistory.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found with orderId');
  }
  const mainResult = {
    info: result,
    details: getOrderHistory[0],
  };

  return mainResult;
};

const updateSmsPoolOrder = async (
  id: string,
  payload: Partial<SmsPoolOrder>,
  userId: string
): Promise<SmsPoolOrder | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const smsPoolOrder = await prisma.smsPoolOrder.findUnique({
    where: {
      id,
    },
  });
  if (!smsPoolOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'SmsPoolOrder not found');
  }

  // check user is admin or not
  if (user.role === UserRole.user) {
    // check user is owner of the order

    if (user.id !== smsPoolOrder?.orderById) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You are not allowed to update this order'
      );
    }
  }
  if (smsPoolOrder.status === ESmsPoolOrderStatus.completed) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not allowed to update completed order'
    );
  }

  // check the order is pending and want to update status to refunded
  if (
    smsPoolOrder.status === ESmsPoolOrderStatus.pending &&
    payload.status === ESmsPoolOrderStatus.refunded
  ) {
    const getThatHistory = await smsPoolRequest.getAllOrderHistory({
      orderId: smsPoolOrder.orderId,
    });
    if (!getThatHistory.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found with orderId');
    }
    console.log(getThatHistory);
    try {
      const refundOrder = await smsPoolRequest.refundOrder({
        orderId: smsPoolOrder.orderId,
      });
      if (refundOrder.success === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to refund order');
      }
    } catch (err) {
      console.log(err);
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to Refund order, Please try again'
      );
    }
    // start a transaction
    const transaction = await prisma.$transaction(async tx => {
      // make a call to smsPoolRequest to refund the order
      // refund the money to user
      const refundMoney = await tx.currency.update({
        where: { ownById: smsPoolOrder.orderById },
        data: { amount: { increment: Number(getThatHistory[0].cost) } },
      });

      return await tx.smsPoolOrder.update({
        where: { id },
        data: { status: ESmsPoolOrderStatus.refunded },
      });
    });
    return transaction;
  }

  // if(payload.status === ESmsPoolOrderStatus.)
  const result = await prisma.smsPoolOrder.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const updateSmsPoolOrderStatus = async (
  id: string,
  payload: Partial<SmsPoolOrder>,
  userId: string
): Promise<SmsPoolOrder | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const smsPoolOrder = await prisma.smsPoolOrder.findUnique({
    where: {
      id,
    },
  });
  if (!smsPoolOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'SmsPoolOrder not found');
  }

  // check user is admin or not
  if (user.role === UserRole.user) {
    // check user is owner of the order

    if (user.id !== smsPoolOrder?.orderById) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You are not allowed to update this order'
      );
    }
  }

  // if(payload.status === ESmsPoolOrderStatus.)
  const result = await prisma.smsPoolOrder.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });
  return result;
};

const deleteSmsPoolOrder = async (id: string): Promise<SmsPoolOrder | null> => {
  const result = await prisma.smsPoolOrder.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SmsPoolOrder not found!');
  }
  return result;
};

export const SmsPoolOrderService = {
  getAllSmsPoolOrder,
  createSmsPoolOrder,
  updateSmsPoolOrder,
  getSingleSmsPoolOrder,
  deleteSmsPoolOrder,
  updateSmsPoolOrderStatus,
};
