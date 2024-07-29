import { Currency, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { round } from 'lodash';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { currencySearchableFields } from './currency.constant';
import { ICurrencyFilters } from './currency.interface';

const getAllCurrency = async (
  filters: ICurrencyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Currency[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = currencySearchableFields.map(single => {
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

  const whereConditions: Prisma.CurrencyWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.currency.findMany({
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
  const total = await prisma.currency.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createCurrency = async (payload: Currency): Promise<Currency | null> => {
  const newCurrency = await prisma.currency.create({
    data: payload,
  });
  return newCurrency;
};

const getSingleCurrency = async (id: string): Promise<Currency | null> => {
  const result = await prisma.currency.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const getSingleCurrencyByUserId = async (
  id: string
): Promise<Currency | null> => {
  let result = await prisma.currency.findUnique({
    where: {
      ownById: id,
    },
  });
  if (!result) {
    const isUserExist = await prisma.user.findUnique({ where: { id } });
    if (isUserExist) {
      result = await prisma.currency.create({
        data: { ownById: isUserExist.id, amount: 0 },
      });
    }
  }
  return result;
};

const updateCurrency = async (
  id: string,
  payload: Partial<Currency>
): Promise<Currency | null> => {
  let result;
  const isCurrencyExits = await prisma.currency.findUnique({
    where: { ownById: id },
  });

  const amountToAdd = payload.amount || 0;

  if (!isCurrencyExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Currency not found!');
  }
  if (amountToAdd > 0) {
    result = await prisma.currency.update({
      where: {
        ownById: id,
      },
      data: {
        amount: {
          increment: amountToAdd,
        },
      },
    });
  } else if (amountToAdd < 0) {
    const newAmount = round(
      isCurrencyExits.amount + amountToAdd,
      config.calculationMoneyRound
    );
    // if new amount is less then 0 then not allow
    if (newAmount < 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'New currency cannot be negative'
      );
    }
    result = await prisma.currency.update({
      where: {
        ownById: id,
      },
      data: {
        amount: {
          decrement: Math.abs(amountToAdd),
        },
      },
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
  }

  return result;
};

const deleteCurrency = async (id: string): Promise<Currency | null> => {
  const result = await prisma.currency.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found!');
  }
  return result;
};

export const CurrencyService = {
  getAllCurrency,
  createCurrency,
  updateCurrency,
  getSingleCurrency,
  deleteCurrency,
  getSingleCurrencyByUserId,
};
