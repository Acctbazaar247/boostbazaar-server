import { Prisma, Review, ReviewReply } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { reviewFilterAbleFields } from './review.constant';
import { ReviewService } from './review.service';
const createReview: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ReviewData = req.body as Review[];
    const user = req.user as JwtPayload;
    const data = ReviewData.map(single => ({
      ...single,
      ownById: user.userId,
    }));
    const result = await ReviewService.createReview(data);
    sendResponse<Prisma.BatchPayload>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review Created successfully!',
      data: result,
    });
  }
);
const createReviewReply: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ReviewData = req.body as ReviewReply;
    const user = req.user as JwtPayload;

    const result = await ReviewService.createReviewReply({
      ...ReviewData,
      ownById: user.userId,
    });

    sendResponse<ReviewReply>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review Created successfully!',
      data: result,
    });
  }
);

const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...reviewFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ReviewService.getAllReview(filters, paginationOptions);

  sendResponse<Review[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleReview: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await ReviewService.getSingleReview(id);

    sendResponse<Review>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review retrieved  successfully!',
      data: result,
    });
  }
);

const updateReview: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await ReviewService.updateReview(id, updateAbleData);

    sendResponse<Review>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review Updated successfully!',
      data: result,
    });
  }
);
const deleteReview: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await ReviewService.deleteReview(id);

    sendResponse<Review>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review deleted successfully!',
      data: result,
    });
  }
);

export const ReviewController = {
  getAllReview,
  createReview,
  updateReview,
  getSingleReview,
  deleteReview,
  createReviewReply,
};
