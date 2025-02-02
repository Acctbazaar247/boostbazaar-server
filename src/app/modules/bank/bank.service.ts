import { Bank, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { bankSearchableFields } from './bank.constant';
import { IBankFilters } from './bank.interface';

const getAllBank = async (
  filters: IBankFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Bank[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = bankSearchableFields.map(single => {
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
  console.log({ filterData });
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

  const whereConditions: Prisma.BankWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.bank.findMany({
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
  });
  const total = await prisma.bank.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createBank = async (payload: Bank): Promise<Bank | null> => {
  const newBank = await prisma.bank.create({
    data: payload,
  });
  return newBank;
};

const getSingleBank = async (id: string): Promise<Bank | null> => {
  const result = await prisma.bank.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBank = async (
  id: string,
  payload: Partial<Bank>
): Promise<Bank | null> => {
  const result = await prisma.bank.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBank = async (id: string): Promise<Bank | null> => {
  const result = await prisma.bank.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bank not found!');
  }
  return result;
};

export const BankService = {
  getAllBank,
  createBank,
  updateBank,
  getSingleBank,
  deleteBank,
};
