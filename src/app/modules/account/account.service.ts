import {
  Account,
  EApprovedForSale,
  Prisma,
  UserRole,
  accountCategory,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { PlanService } from '../plan/plan.service';
import { accountSearchableFields } from './account.constant';
import { IAccountFilters } from './account.interface';

const getAllAccount = async (
  filters: IAccountFilters,
  paginationOptions: IPaginationOptions
): Promise<
  IGenericResponse<
    Omit<
      Account,
      | 'username'
      | 'password'
      | 'additionalEmail'
      | 'additionalPassword'
      | 'additionalDescription'
      | 'additionalImage'
    >[]
  >
> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, maxPrice, minPrice, category, planType, ...filterData } =
    filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = accountSearchableFields.map(single => {
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
  if (maxPrice) {
    andCondition.push({
      price: {
        lte: Number(maxPrice),
      },
    });
  }
  if (minPrice) {
    andCondition.push({
      price: {
        gte: Number(minPrice),
      },
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keyChecker = (data: any, key: string): any => {
    const keysToCheck = ['isSold'];
    if (keysToCheck.includes(key)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return JSON.parse((filterData as any)[key]);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (filterData as any)[key];
  };
  if (Object.keys(filters).length) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: keyChecker(filterData, key),
        },
      })),
    });
  }
  if (category) {
    const categories = category.split('-') as accountCategory[];
    const categoryQuery: Prisma.AccountWhereInput = {
      AND: {
        category: {
          in: categories,
        },
      },
    };
    andCondition.push(categoryQuery);
  }
  if (planType) {
    const planQuery: Prisma.AccountWhereInput = {
      AND: {
        ownBy: {
          Plan: {
            planType: planType,
          },
        },
      },
    };
    andCondition.push(planQuery);
  }
  const forNotBlockedSeller: Prisma.AccountWhereInput = {
    OR: [
      {
        ownBy: {
          isBlocked: false,
        },
      },
      {
        ownBy: {
          isBlocked: null,
        },
      },
    ],
  };
  andCondition.push(forNotBlockedSeller);
  const whereConditions: Prisma.AccountWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.account.findMany({
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
      category: true,
      approvedForSale: true,
      description: true,
      createdAt: true,
      isSold: true,
      Cart: true,
      name: true,
      price: true,
      updatedAt: true,
      ownById: true,
      accountType: true,
      preview: true,
      messageFromAdmin: true,
      ownBy: {
        select: {
          name: true,
          profileImg: true,
          email: true,
          id: true,
          isVerified: true,
          isVerifiedByAdmin: true,
          role: true,
        },
      },
    },
  });
  const total = await prisma.account.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createAccount = async (payload: Account): Promise<Account | null> => {
  const isAccountOwnerExits = await prisma.user.findUnique({
    where: { id: payload.ownById },
  });
  if (!isAccountOwnerExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (
    isAccountOwnerExits.role === UserRole.seller &&
    !isAccountOwnerExits.isApprovedForSeller
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Your are not approved as seller'
    );
  }
  const newAccount = await prisma.account.create({
    data: payload,
  });
  return newAccount;
};
const createAccountMultiple = async (
  payload: Account[]
): Promise<Prisma.BatchPayload | null> => {
  const info = await PlanService.getHowManyUploadLeft(payload[0].ownById);
  // check is upload limit exist
  if (!info.left) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You have already upload ${info.uploaded} accounts.`
    );
  }
  // check if
  const currentUploadWillBe = info.left - payload.length;
  if (currentUploadWillBe < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You have ${info.left} accounts left to upload today`
    );
  }
  const newAccount = await prisma.account.createMany({
    data: payload,
  });
  return newAccount;
};

const getSingleAccount = async (id: string): Promise<Account | null> => {
  const result = await prisma.account.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAccount = async (
  id: string,
  payload: Partial<Account>,
  { id: reqUserId, role }: { id: string; role: UserRole }
): Promise<Omit<Account, 'username' | 'password'> | null> => {
  console.log(payload);
  const isAccountExits = await prisma.account.findUnique({
    where: { id },
    include: { ownBy: { select: { email: true } } },
  });
  const notAdmin = role !== UserRole.admin;
  const notSuperAdmin = role !== UserRole.superAdmin;
  const notCcAdmin = role !== UserRole.ccAdmin;
  const notPrAdmin = role !== UserRole.prAdmin;
  if (notAdmin && notSuperAdmin && notCcAdmin && notPrAdmin) {
    // check if he is not owner
    if (isAccountExits?.ownById !== reqUserId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You didn't own this account!"
      );
    }
  }
  // const isUserExist = await prisma.account.findUnique({where:{id:reqById,}})

  if (!isAccountExits) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found!');
  }
  if (isAccountExits.isSold) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "sold account can't be updated!"
    );
  }

  const result = await prisma.account.update({
    where: {
      id,
    },
    data: payload,
  });
  if (
    payload.approvedForSale === EApprovedForSale.approved &&
    isAccountExits.approvedForSale !== EApprovedForSale.approved
  ) {
    // await sendEmailToEveryOne({
    //   accountName: result.name,
    //   category: result.category,
    //   description: result.description,
    //   price: result.price,
    //   without: [isAccountExits.ownBy?.email],
    // });
  }
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { username, password, ...rest } = result;
  return rest;
};

const deleteAccount = async (
  id: string
): Promise<Omit<Account, 'username' | 'password'> | null> => {
  const isAccountExits = await prisma.account.findUnique({ where: { id } });

  if (!isAccountExits) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found!');
  }
  if (isAccountExits.isSold) {
    throw new ApiError(httpStatus.BAD_REQUEST, "sold account can't be delete!");
  }
  const result = await prisma.account.delete({
    where: { id },
  });
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { username, password, ...rest } = result;
  return rest;
};

export const AccountService = {
  getAllAccount,
  createAccount,
  updateAccount,
  getSingleAccount,
  deleteAccount,
  createAccountMultiple,
};
