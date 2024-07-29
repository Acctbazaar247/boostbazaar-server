import { EStatusOfKyc, Kyc, Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { kycSearchableFields } from './kyc.constant';
import { IKycFilters } from './kyc.interface';

const getAllKyc = async (
  filters: IKycFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Kyc[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, email, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = kycSearchableFields.map(single => {
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
  if (email) {
    const emailQuery: Prisma.KycWhereInput = {
      AND: {
        ownBy: {
          email,
        },
      },
    };
    andCondition.push(emailQuery);
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

  const whereConditions: Prisma.KycWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.kyc.findMany({
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
          id: true,
          name: true,
          email: true,
          profileImg: true,
          phoneNumber: true,
        },
      },
    },
  });
  const total = await prisma.kyc.count({ where: whereConditions });
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createKyc = async (payload: Kyc): Promise<Kyc | null> => {
  const isExits = await prisma.kyc.findUnique({
    where: { ownById: payload.ownById },
    select: { id: true },
  });
  if (isExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Kyc Already exits');
  }
  if (payload.meansOfIdentification === 'PASSPORT') {
    if (!payload.identificationExpiredDate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'identificationExpiredDate is required'
      );
    }
  }
  const newKyc = await prisma.kyc.create({
    data: payload,
  });
  return newKyc;
};

const getSingleKyc = async (id: string): Promise<Kyc | null> => {
  const result = await prisma.kyc.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const getSingleKycOfUser = async (id: string): Promise<Kyc | null> => {
  const result = await prisma.kyc.findUnique({
    where: {
      ownById: id,
    },
  });
  return result;
};

const updateKyc = async (
  id: string,
  payload: Partial<Kyc>,
  requestedUserId: string
): Promise<Kyc | null> => {
  const requestedUser = await prisma.user.findUnique({
    where: { id: requestedUserId },
    select: {
      role: true,
      id: true,
    },
  });
  if (!requestedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const isKycExits = await prisma.kyc.findUnique({
    where: { id },
    select: { id: true, ownById: true, userName: true, name: true },
  });
  if (!isKycExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Kyc not found!');
  }
  const isSeller = requestedUser.role === UserRole.seller;
  const isWantToUpdateStatus = payload.status === EStatusOfKyc.approved;
  if (isSeller && isWantToUpdateStatus) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You can not able to update this kyc!'
    );
  }
  // check is own by this seller
  if (isSeller) {
    if (isKycExits.ownById !== requestedUser.id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You can not able to update this kyc!'
      );
    }
  }
  const byAdmin = requestedUser.role === UserRole.superAdmin;
  const statusIsApprove = payload.status === EStatusOfKyc.approved;
  if (byAdmin && statusIsApprove) {
    const result = await prisma.$transaction(async tx => {
      await tx.user.update({
        where: { id: isKycExits.ownById },
        data: { isVerifiedByAdmin: true, userName: isKycExits.userName },
      });
      const updatedKyc = await tx.kyc.update({ where: { id }, data: payload });
      return updatedKyc;
    });
    return result;
  }
  // if (statusIsApprove) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot update status');
  // }
  const result = await prisma.kyc.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteKyc = async (id: string): Promise<Kyc | null> => {
  const isKycExits = await prisma.kyc.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (isKycExits && isKycExits.status === 'approved') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'you cannot delete approved kyc'
    );
  }
  const result = await prisma.kyc.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kyc not found!');
  }
  return result;
};

export const KycService = {
  getAllKyc,
  createKyc,
  updateKyc,
  getSingleKyc,
  deleteKyc,
  getSingleKycOfUser,
};
