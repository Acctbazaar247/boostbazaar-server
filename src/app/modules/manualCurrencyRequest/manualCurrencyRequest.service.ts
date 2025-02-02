import {
  EStatusOfManualCurrencyRequest,
  ManualCurrencyRequest,
  Prisma,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import emailEvents from '../../events/emailEvents';
import { manualCurrencyRequestSearchableFields } from './manualCurrencyRequest.constant';
import { IManualCurrencyRequestFilters } from './manualCurrencyRequest.interface';

const getAllManualCurrencyRequest = async (
  filters: IManualCurrencyRequestFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ManualCurrencyRequest[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = manualCurrencyRequestSearchableFields.map(
      single => {
        const query = {
          [single]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        };
        return query;
      }
    );
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

  const whereConditions: Prisma.ManualCurrencyRequestWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.manualCurrencyRequest.findMany({
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
      id: true,
      message: true,
      image: true,
      requestedAmount: true,
      receivedAmount: true,
      ownById: true,
      status: true,
      accountName: true,
      accountNumber: true,
      bankName: true,
      transactionHash: true,
      dollarRate: true,
      createdAt: true,
      updatedAt: true,
      bankId: true,
      cryptoBankId: true,
      ownBy: {
        select: {
          id: true,
          email: true,
          name: true,
          profileImg: true,
        },
      },
      bank: {
        select: {
          id: true,
          accountName: true,
          accountNumber: true,
          bankName: true,
        },
      },
      cryptoBank: {
        select: {
          id: true,
          walletAddress: true,
          name: true,
        },
      },
    },
  });
  const total = await prisma.manualCurrencyRequest.count({
    where: whereConditions,
  });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createManualCurrencyRequest = async (
  payload: ManualCurrencyRequest
): Promise<ManualCurrencyRequest | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: payload.ownById,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No user found');
  }
  // if bankId is provided then check is it exist on bank

  if (payload.bankId) {
    const isBankIdExist = await prisma.bank.findUnique({
      where: {
        id: payload.bankId,
      },
    });
    if (!isBankIdExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Bank not found!');
    }
  }
  if (payload.cryptoBankId) {
    const isCryptoBankIdExist = await prisma.cryptoBank.findUnique({
      where: {
        id: payload.cryptoBankId,
      },
    });
    if (!isCryptoBankIdExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'CryptoBank not found!');
    }
  }

  const newManualCurrencyRequest = await prisma.manualCurrencyRequest.create({
    data: payload,
  });
  emailEvents.emit(
    'send-manual-currency-request-email-to-admin',
    user.name,
    payload.requestedAmount
  );
  return newManualCurrencyRequest;
};

const getSingleManualCurrencyRequest = async (
  id: string
): Promise<ManualCurrencyRequest | null> => {
  const result = await prisma.manualCurrencyRequest.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateManualCurrencyRequest = async (
  id: string,
  payload: Partial<ManualCurrencyRequest>
): Promise<ManualCurrencyRequest | null> => {
  // check is data exist
  const isManualCurrencyRequestExist =
    await prisma.manualCurrencyRequest.findUnique({
      where: {
        id,
      },
    });
  if (!isManualCurrencyRequestExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'ManualCurrencyRequest not found!'
    );
  }
  // check is status is denied

  if (
    isManualCurrencyRequestExist.status ===
    EStatusOfManualCurrencyRequest.denied
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can't update denied currency request"
    );
  }
  // check is status already approved
  if (
    isManualCurrencyRequestExist.status ===
    EStatusOfManualCurrencyRequest.approved
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can't update approved currency request"
    );
  }
  // check is status is pending
  let result;
  if (payload.status === EStatusOfManualCurrencyRequest.approved) {
    result = await prisma.$transaction(async tx => {
      const user = await tx.user.findUnique({
        where: {
          id: isManualCurrencyRequestExist.ownById,
        },
        select: {
          id: true,
          email: true,
          Currency: {
            select: {
              id: true,
              amount: true,
            },
          },
        },
      });
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
      }

      if (!user.Currency?.id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User Currency not found!');
      }
      let amountToIncrement = 0;
      if (payload.receivedAmount === null) {
        amountToIncrement = isManualCurrencyRequestExist.requestedAmount;
      } else if (payload.receivedAmount === undefined) {
        amountToIncrement = isManualCurrencyRequestExist.requestedAmount;
      } else {
        amountToIncrement = payload.receivedAmount;
      }
      // now safely increase user curreny
      const updateUserCurrency = await tx.currency.update({
        where: {
          id: user.Currency.id,
        },
        data: {
          amount: {
            increment: amountToIncrement,
          },
        },
      });

      const output = await tx.manualCurrencyRequest.update({
        where: {
          id: isManualCurrencyRequestExist.id,
        },
        data: {
          status: EStatusOfManualCurrencyRequest.approved,
          receivedAmount: amountToIncrement,
        },
      });
      emailEvents.emit(
        'send-manual-currency-request-email',
        user.email,
        amountToIncrement
      );

      return output;
    });
  } else {
    result = await prisma.manualCurrencyRequest.update({
      where: {
        id: isManualCurrencyRequestExist.id,
      },
      data: payload,
    });
  }
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
  }
  return result;
};

const deleteManualCurrencyRequest = async (
  id: string
): Promise<ManualCurrencyRequest | null> => {
  const result = await prisma.manualCurrencyRequest.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'ManualCurrencyRequest not found!'
    );
  }
  return result;
};

export const ManualCurrencyRequestService = {
  getAllManualCurrencyRequest,
  createManualCurrencyRequest,
  updateManualCurrencyRequest,
  getSingleManualCurrencyRequest,
  deleteManualCurrencyRequest,
};
