import { Prisma, Review, ReviewReply } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { reviewSearchableFields } from './review.constant';
import { IReviewFilters } from './review.interface';

const getAllReview = async (
  filters: IReviewFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Review[]>> => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = reviewSearchableFields.map(single => {
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

  const whereConditions: Prisma.ReviewWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.review.findMany({
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
      accountId: true,
      sellerId: true,
      seller: {
        select: { id: true, name: true, profileImg: true },
      },
      ownById: true,
      createdAt: true,
      updatedAt: true,
      reviewText: true,
      reviewStatus: true,
      isAnonymous: true,
      ReviewReply: {
        select: {
          id: true,
          reply: true,
          ownById: true,
          createdAt: true,
          ownBy: {
            select: {
              name: true,
              id: true,
              profileImg: true,
            },
          },
        },
      },
      ownBy: {
        select: { id: true, email: true, profileImg: true, name: true },
      },
    },
  });
  const total = await prisma.review.count();
  const output = {
    data: result,
    meta: { page, limit, total },
  };
  return output;
};

const createReview = async (
  payload: Review[]
): Promise<Prisma.BatchPayload | null> => {
  const newReview = await prisma.review.createMany({
    data: payload,
  });
  return newReview;
};
const createReviewReply = async (
  payload: ReviewReply
): Promise<ReviewReply | null> => {
  const isReviewExits = await prisma.review.findUnique({
    where: { id: payload.reviewId },
  });
  if (!isReviewExits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Review not found to reply');
  }

  // check the person is he relative to the conversation
  const isNotSeller = isReviewExits.sellerId !== payload.ownById;
  const isNotBuyer = isReviewExits.ownById !== payload.ownById;
  if (isNotBuyer && isNotSeller) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not allowed to reply on this conversation'
    );
  }

  const newReview = await prisma.reviewReply.create({
    data: payload,
  });
  return newReview;
};

const getSingleReview = async (id: string): Promise<Review | null> => {
  const result = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateReview = async (
  id: string,
  payload: Partial<Review>
): Promise<Review | null> => {
  const result = await prisma.review.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteReview = async (id: string): Promise<Review | null> => {
  const result = await prisma.review.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found!');
  }
  return result;
};

export const ReviewService = {
  getAllReview,
  createReview,
  updateReview,
  getSingleReview,
  deleteReview,
  createReviewReply,
};
