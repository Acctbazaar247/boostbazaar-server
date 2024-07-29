import { Prisma, Referral } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { referralSearchableFields } from './referral.constant';
import { IReferralFilters } from './referral.interface';

const getAllReferral = async (
  filters: IReferralFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Referral[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = referralSearchableFields.map(single => {
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

  const whereConditions: Prisma.ReferralWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.referral.findMany({
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
      amount: true,
      createdAt: true,
      id: true,
      ownById: true,
      ownBy: {
        select: {
          name: true,
          profileImg: true,
          id: true,
          email: true,
        },
      },
      referralById: true,
      status: true,
      updatedAt: true,
    },
  });
  const total = await prisma.referral.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createReferral = async (payload: Referral): Promise<Referral | null> => {
  const newReferral = await prisma.referral.create({
    data: payload,
  });
  return newReferral;
};

const getSingleReferral = async (id: string): Promise<Referral | null> => {
  const result = await prisma.referral.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateReferral = async (
  id: string,
  payload: Partial<Referral>
): Promise<Referral | null> => {
  const result = await prisma.referral.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteReferral = async (id: string): Promise<Referral | null> => {
  const result = await prisma.referral.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found!');
  }
  return result;
};

export const ReferralService = {
  getAllReferral,
  createReferral,
  updateReferral,
  getSingleReferral,
  deleteReferral,
};
