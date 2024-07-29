import { EPlanType, Plan, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { planSearchableFields } from './plan.constant';
import { IBasicPlan, IPlanFilters, IPlanUploadCount } from './plan.interface';
import calculateDaysLeft, { getAccountsUploadedToday } from './plan.utils';

const getAllPlan = async (
  filters: IPlanFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Plan[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, isActive, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = planSearchableFields.map(single => {
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
  if (isActive) {
    andCondition.push({
      AND: {
        isActive: JSON.parse(isActive),
      },
    });
  }

  const whereConditions: Prisma.PlanWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.plan.findMany({
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
    select: {
      createdAt: true,
      id: true,
      days: true,
      isActive: true,
      limit: true,
      planType: true,
      ownById: true,
      updatedAt: true,
      ownBy: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImg: true,
        },
      },
    },
  });

  const total = await prisma.plan.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createPlan = async (
  payload: Plan,
  userId: string
): Promise<Plan | null> => {
  // check does he has active plan

  const isActivePlanExits = await prisma.plan.findFirst({
    where: {
      ownById: userId,
    },
  });

  if (isActivePlanExits && isActivePlanExits.isActive) {
    if (
      !calculateDaysLeft(isActivePlanExits.createdAt, isActivePlanExits.days)
    ) {
      const update = await prisma.plan.update({
        where: { ownById: userId },
        data: { isActive: false },
      });
      if (update.isActive) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Try again latter');
      }
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You already have a active plan'
      );
    }
  }

  // check wallet of user
  const isCurrencyExits = await prisma.currency.findUnique({
    where: { ownById: userId },
  });

  if (!isCurrencyExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User wallet not found');
  }
  let price: number;
  let limit: number;
  let days: number;
  if (payload.planType === EPlanType.pro) {
    if (isCurrencyExits.amount < config.proPlanPrice) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Not enough money left in wallet'
      );
    }
    price = config.proPlanPrice;
    limit = config.proPlanLimit;
    days = config.proPlanDays;
  } else if (payload.planType === EPlanType.proPlus) {
    if (isCurrencyExits.amount < config.proPlusPlanPrice) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Not enough money left in wallet'
      );
    }
    price = config.proPlusPlanPrice;
    limit = config.proPlusPlanLimit;
    days = config.proPlusPlanDays;
  } else if (payload.planType === EPlanType.basic) {
    if (isCurrencyExits.amount < config.basicPlanPrice) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Not enough money left in wallet'
      );
    }
    price = config.basicPlanPrice;
    limit = config.basicPlanLimit;
    days = config.basicPlanDays;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You request is not valid');
  }

  // cut money from the user and add it to admin
  const isAdminExist = await prisma.user.findUnique({
    where: { email: config.mainAdminEmail },
    select: { id: true },
  });
  if (!isAdminExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Something went wrong try again latter'
    );
  }

  const newPlan = await prisma.$transaction(async tx => {
    // delete previous plan
    if (isActivePlanExits) {
      await tx.plan.delete({ where: { ownById: userId } });
    }
    // cut money form user
    await tx.currency.update({
      where: { ownById: userId },
      data: {
        amount: {
          decrement: price,
        },
      },
    });
    // add money to admin
    await tx.currency.update({
      where: { ownById: isAdminExist.id },
      data: {
        amount: {
          increment: price,
        },
      },
    });

    const result = await tx.plan.create({
      data: {
        ...payload,
        ownById: userId,
        isActive: true,
        limit,
        days,
      },
    });
    return result;
  });
  return newPlan;
};

const getSinglePlan = async (id: string): Promise<Plan | null> => {
  const result = await prisma.plan.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const getActivePlan = async (id: string): Promise<Plan | null | IBasicPlan> => {
  const result = await prisma.plan.findUnique({
    where: {
      ownById: id,
      isActive: true,
    },
  });
  if (!result) {
    return {
      id,
      ownById: id,
      isActive: true,
      planType: 'default',
      limit: config.defaultPlanLimit,
      days: 'life time',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // check if time is up then update the plan to in active
  if (!calculateDaysLeft(result.createdAt, result.days)) {
    const update = await prisma.plan.update({
      where: { ownById: id },
      data: { isActive: false },
    });
    if (update.isActive) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Try again latter');
    }
    return update;
  }
  return result;
};
const getHowManyUploadLeft = async (id: string): Promise<IPlanUploadCount> => {
  const count = await getAccountsUploadedToday(id);

  // calculate amount in here
  const isPlanExist = await prisma.plan.findUnique({ where: { ownById: id } });
  let totalPossibleUpload = 0;
  if (!isPlanExist) {
    totalPossibleUpload = config.defaultPlanLimit;
  } else {
    totalPossibleUpload = isPlanExist.limit;
  }
  return { uploaded: count, left: Math.max(totalPossibleUpload - count, 0) };
};

const updatePlan = async (
  id: string,
  payload: Partial<Plan>
): Promise<Plan | null> => {
  const result = await prisma.plan.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deletePlan = async (id: string): Promise<Plan | null> => {
  const result = await prisma.plan.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found!');
  }
  return result;
};

export const PlanService = {
  getAllPlan,
  createPlan,
  updatePlan,
  getSinglePlan,
  deletePlan,
  getActivePlan,
  getHowManyUploadLeft,
};
