import {
  EStatusOfWithdrawalRequest,
  Prisma,
  WithdrawalRequest,
} from '@prisma/client';
import axios from 'axios';
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { round } from 'lodash';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { withdrawalRequestSearchableFields } from './withdrawalRequest.constant';
import { IWithdrawalRequestFilters } from './withdrawalRequest.interface';
const getAllWithdrawalRequest = async (
  filters: IWithdrawalRequestFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<WithdrawalRequest[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;
  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = withdrawalRequestSearchableFields.map(single => {
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

  const whereConditions: Prisma.WithdrawalRequestWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.withdrawalRequest.findMany({
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
      ownBy: {
        select: {
          name: true,
          email: true,
          id: true,
          phoneNumber: true,
          profileImg: true,
        },
      },
    },
  });
  const total = await prisma.withdrawalRequest.count({
    where: whereConditions,
  });
  console.log(whereConditions, await prisma.withdrawalRequest.count());
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createWithdrawalRequest = async (
  payload: WithdrawalRequest,
  requestBy: JwtPayload,
  withdrawalPin: string
): Promise<WithdrawalRequest | null> => {
  const MAIN_ADMIN_EMAIL = config.mainAdminEmail;

  const isUserExist = await prisma.user.findUnique({
    where: { id: requestBy.userId },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  if (!isUserExist.withdrawalPin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Add a withdrawal pin first');
  }
  if (!(await bcryptjs.compare(withdrawalPin, isUserExist.withdrawalPin))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Withdrawal pin does not match!'
    );
  }
  if (isUserExist.email === MAIN_ADMIN_EMAIL) {
    // check does this request is made from main admin
    const newWithdrawalRequest = await prisma.$transaction(async tx => {
      // get previous currency
      const preCurrency = await tx.currency.findFirst({
        where: { ownById: isUserExist.id },
      });
      if (!preCurrency) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Currency not found for this admin'
        );
      }
      if (preCurrency.amount < payload.amount) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "That much amount doesn't exist"
        );
      }
      // delete same monkey from the admin
      await tx.currency.update({
        where: { ownById: isUserExist.id },
        data: {
          amount: round(
            preCurrency.amount - payload.amount,
            config.calculationMoneyRound
          ),
        },
      });

      return await tx.withdrawalRequest.create({
        data: { ...payload, status: EStatusOfWithdrawalRequest.approved },
      });
    });

    return newWithdrawalRequest;
  } else {
    // for normal user seller and not main admin
    const newWithdrawalRequest = await prisma.$transaction(async tx => {
      // get the user currency
      const preCurrency = await tx.currency.findFirst({
        where: { ownById: isUserExist.id },
      });
      if (!preCurrency) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Currency not found');
      }
      if (preCurrency.amount < payload.amount) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "That much amount doesn't exist"
        );
      }
      // cut monkey
      await tx.currency.update({
        where: { ownById: isUserExist.id },
        data: {
          amount: round(
            preCurrency.amount - payload.amount,
            config.calculationMoneyRound
          ),
        },
      });
      // create withdrawal request

      return await tx.withdrawalRequest.create({
        data: { ...payload, status: EStatusOfWithdrawalRequest.pending },
      });
    });
    return newWithdrawalRequest;
  }
};

const getSingleWithdrawalRequest = async (
  id: string
): Promise<WithdrawalRequest | null> => {
  const result = await prisma.withdrawalRequest.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const getSingleUserWithdrawalRequest = async (
  id: string
): Promise<WithdrawalRequest[] | null> => {
  const result = await prisma.withdrawalRequest.findMany({
    where: {
      ownById: id,
    },
  });
  return result;
};

const updateWithdrawalRequest = async (
  id: string,
  payload: Partial<WithdrawalRequest>
): Promise<WithdrawalRequest | null> => {
  const isWithdrawalRequestExits = await prisma.withdrawalRequest.findFirst({
    where: { id },
  });
  if (!isWithdrawalRequestExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not found!');
  }

  //  check is it already updated to status approved
  if (isWithdrawalRequestExits.status === EStatusOfWithdrawalRequest.approved) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Approved request can't be update"
    );
  }

  //  check is it already updated to status denied
  if (isWithdrawalRequestExits.status === EStatusOfWithdrawalRequest.denied) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "status is Denied  can't be update"
    );
  }
  // now current status is pending

  // if update to approved
  if (payload.status === EStatusOfWithdrawalRequest.approved) {
    // now update admin currency only and withdrawal request to updated'
    return await prisma.$transaction(async tx => {
      const isAdminExits = await tx.user.findFirst({
        where: { email: config.mainAdminEmail },
        include: { Currency: true },
      });

      if (!isAdminExits || !isAdminExits.Currency) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Admin not found or admin currency not found'
        );
      }

      // give few percentage to admin

      const amountToWithDraw = isWithdrawalRequestExits.amount;

      const adminFee = (config.withdrawalPercentage / 100) * amountToWithDraw;
      const roundedAdminFee = round(adminFee, config.calculationMoneyRound);

      // give money to admin
      await tx.currency.update({
        where: { ownById: isAdminExits.id },
        data: {
          amount: {
            increment: roundedAdminFee,
          },
        },
      });

      return await tx.withdrawalRequest.update({
        where: {
          id,
        },
        data: payload,
      });
    });
  } else if (payload.status === EStatusOfWithdrawalRequest.denied) {
    // if update to denied
    // get back money
    return await prisma.$transaction(async tx => {
      const isUserCurrencyExist = await tx.currency.findFirst({
        where: { ownById: isWithdrawalRequestExits.ownById },
      });
      if (!isUserCurrencyExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User currency not found!');
      }

      // update user money
      await tx.currency.update({
        where: { ownById: isUserCurrencyExist.ownById },
        data: {
          amount: {
            increment: isWithdrawalRequestExits.amount,
          },
        },
      });
      return await tx.withdrawalRequest.update({
        where: {
          id,
        },
        data: payload,
      });
    });
  }
  throw new ApiError(
    httpStatus.BAD_REQUEST,
    'Only status with message can able to update '
  );
};

const deleteWithdrawalRequest = async (
  id: string
): Promise<WithdrawalRequest | null> => {
  // please get back the money you have cut on when creating
  const isWithdrawalRequestExits = await prisma.withdrawalRequest.findUnique({
    where: { id },
  });

  if (!isWithdrawalRequestExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not found!');
  }

  // if status is pending than return money
  if (isWithdrawalRequestExits.status === EStatusOfWithdrawalRequest.pending) {
    return await prisma.$transaction(async tx => {
      const isUserCurrencyExist = await tx.currency.findFirst({
        where: { ownById: isWithdrawalRequestExits.ownById },
      });
      if (!isUserCurrencyExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User currency not found!');
      }

      // update user money
      await tx.currency.update({
        where: { ownById: isUserCurrencyExist.ownById },
        data: { amount: { increment: isWithdrawalRequestExits.amount } },
      });
      return await tx.withdrawalRequest.delete({
        where: { id },
      });
    });
  }
  const result = await prisma.withdrawalRequest.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WithdrawalRequest not found!');
  }
  return result;
};
const getWithdrawalBank = async (): Promise<unknown | null> => {
  const response = await axios.get('https://api.paystack.co/bank');
  return response.data;
};

export const WithdrawalRequestService = {
  getAllWithdrawalRequest,
  createWithdrawalRequest,
  updateWithdrawalRequest,
  getSingleWithdrawalRequest,
  deleteWithdrawalRequest,
  getSingleUserWithdrawalRequest,
  getWithdrawalBank,
};
