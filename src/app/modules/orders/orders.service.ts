import { Orders, Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import sendEmail from '../../../helpers/sendEmail';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import EmailTemplates from '../../../shared/EmailTemplates';
import prisma from '../../../shared/prisma';
import { TService } from '../service/service.interface';
import { ServiceService } from '../service/service.service';
import createOrder from '../service/service.utils';
import { ordersSearchableFields } from './orders.constant';
import { IOrdersFilters } from './orders.interface';

const getAllOrders = async (
  filters: IOrdersFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Orders[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, email, ...filterData } = filters;

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
          equals: (filterData as never)[key],
        },
      })),
    });
  }
  if (email) {
    andCondition.push({
      AND: {
        orderBy: {
          email,
        },
      },
    } as Prisma.OrdersWhereInput);
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
      orderBy: {
        select: {
          name: true,
          profileImg: true,
          id: true,
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
  // get all service
  const allService = await ServiceService.getAllService();
  const mainService = allService.find(
    single => single.service.toString() === payload.japServiceId
  ) as TService | undefined;

  if (!mainService) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'service not found!');
  }
  const isLessThenMin = parseFloat(mainService.min) > payload.quantity;
  const isMoreThenMax = parseFloat(mainService.max) < payload.quantity;

  if (isLessThenMin || isMoreThenMax) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `The quantity cant be more then ${mainService.max} and less then ${mainService.min}`
    );
  }
  const increaseRatePrice =
    (config.japPercentage / 100) * parseFloat(mainService.rate);
  const sum = increaseRatePrice + parseFloat(mainService.rate);
  // 1000 is 1 unit
  let cost = sum;
  if (mainService.min === '1' && mainService.max === '1') {
    cost = sum;
  } else {
    const calculatePerUnitCost = sum / 1000;
    cost = calculatePerUnitCost * payload.quantity;
  }
  const userCurrency = await prisma.currency.findUnique({
    where: { ownById: payload.orderById },
  });

  if (!userCurrency) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user currency not found!');
  }
  // check user have that amount
  if (userCurrency.amount < cost) {
    throw new ApiError(httpStatus.BAD_REQUEST, `You don't have enough amount!`);
  }
  const admin = await prisma.user.findFirst({
    where: { role: UserRole.admin, email: config.mainAdminEmail },
    select: {
      id: true,
    },
  });
  if (!admin?.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Something went wrong no admin found!'
    );
  }
  // make order in jap
  const japOrderId = await createOrder(
    payload.japServiceId,
    payload.link,
    payload.quantity
  );
  // const japOrderId = 'random';
  if (!japOrderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'failed to make orders');
  }

  // make the order
  const output = await prisma.$transaction(async tx => {
    // cut seller amount
    const costNumber = parseFloat(Number(cost).toFixed(2));
    const userCurrencyUpdate = await tx.currency.update({
      where: { ownById: payload.orderById },
      data: {
        amount: {
          decrement: costNumber,
        },
      },
    });
    if (userCurrencyUpdate.amount < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
    }
    // add amount to admin
    await tx.currency.update({
      where: { ownById: admin.id },
      data: {
        amount: { increment: costNumber },
      },
    });
    const newOrders = await tx.orders.create({
      data: {
        ...payload,
        japOrderId: japOrderId.toString(),
        charge: costNumber,
      },
    });
    return newOrders;
  });
  const userEmail = await prisma.user.findFirst({
    where: { id: payload.orderById },
    select: { email: true },
  });
  if (userEmail?.email) {
    sendEmail(
      { to: userEmail.email },
      {
        subject: EmailTemplates.orderSuccessful.subject,
        html: EmailTemplates.orderSuccessful.html(),
      }
    );
  }
  return output;
};

const getSingleOrders = async (id: string): Promise<Orders | null> => {
  const result = await prisma.orders.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOrders = async (
  id: string,
  payload: Partial<Orders>
): Promise<Orders | null> => {
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
};
