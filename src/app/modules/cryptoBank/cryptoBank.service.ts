import { CryptoBank, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { cryptoBankSearchableFields } from './cryptoBank.constant';
import { ICryptoBankFilters } from './cryptoBank.interface';

const getAllCryptoBank = async (
  filters: ICryptoBankFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<CryptoBank[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = cryptoBankSearchableFields.map(single => {
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

  const whereConditions: Prisma.CryptoBankWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.cryptoBank.findMany({
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
  const total = await prisma.cryptoBank.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createCryptoBank = async (
  payload: CryptoBank
): Promise<CryptoBank | null> => {
  const newCryptoBank = await prisma.cryptoBank.create({
    data: payload,
  });
  return newCryptoBank;
};

const getSingleCryptoBank = async (id: string): Promise<CryptoBank | null> => {
  const result = await prisma.cryptoBank.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateCryptoBank = async (
  id: string,
  payload: Partial<CryptoBank>
): Promise<CryptoBank | null> => {
  const result = await prisma.cryptoBank.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteCryptoBank = async (id: string): Promise<CryptoBank | null> => {
  const result = await prisma.cryptoBank.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CryptoBank not found!');
  }
  return result;
};

export const CryptoBankService = {
  getAllCryptoBank,
  createCryptoBank,
  updateCryptoBank,
  getSingleCryptoBank,
  deleteCryptoBank,
};
