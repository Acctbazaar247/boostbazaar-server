import { WithdrawalRequest } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import catchAsyncSemaphore from '../../../shared/catchAsyncSemaphore';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { withdrawalRequestFilterAbleFields } from './withdrawalRequest.constant';
import { WithdrawalRequestService } from './withdrawalRequest.service';
const createWithdrawalRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const WithdrawalRequestData = req.body;
    const user = req.user as JwtPayload;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = {
      amount: WithdrawalRequestData.amount,
    };
    console.log(WithdrawalRequestData);
    if (
      WithdrawalRequestData.walletAddress &&
      WithdrawalRequestData.isTrc !== undefined
    ) {
      data.walletAddress = WithdrawalRequestData.walletAddress;
      data.isTrc = WithdrawalRequestData.isTrc;
    } else if (
      WithdrawalRequestData.accountNumber &&
      WithdrawalRequestData.fullName &&
      WithdrawalRequestData.bankName
    ) {
      data = {
        amount: WithdrawalRequestData.amount,
        fullName: WithdrawalRequestData.fullName,
        accountNumber: WithdrawalRequestData.accountNumber,
        bankName: WithdrawalRequestData.bankName,
      };
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Data didn't pass properly");
    }

    const result = await WithdrawalRequestService.createWithdrawalRequest(
      {
        ...data,
        ownById: user.userId,
      },
      user,
      WithdrawalRequestData.withdrawalPin
    );
    sendResponse<WithdrawalRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'WithdrawalRequest Created successfully!',
      data: result,
    });
  }
);

const getAllWithdrawalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, [
      'searchTerm',
      ...withdrawalRequestFilterAbleFields,
    ]);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await WithdrawalRequestService.getAllWithdrawalRequest(
      filters,
      paginationOptions
    );

    sendResponse<WithdrawalRequest[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'WithdrawalRequest retrieved successfully !',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleWithdrawalRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await WithdrawalRequestService.getSingleWithdrawalRequest(
      id
    );

    sendResponse<WithdrawalRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'WithdrawalRequest retrieved  successfully!',
      data: result,
    });
  }
);
const getWithdrawalBank: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await WithdrawalRequestService.getWithdrawalBank();

    sendResponse<unknown>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Withdrawal bank retrieved  successfully!',
      data: result,
    });
  }
);
const getSingleUserWithdrawalRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const id = user.userId;

    const result =
      await WithdrawalRequestService.getSingleUserWithdrawalRequest(id);

    sendResponse<WithdrawalRequest[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'WithdrawalRequest retrieved  successfully!',
      data: result,
    });
  }
);

const updateWithdrawalRequest: RequestHandler = catchAsyncSemaphore(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await WithdrawalRequestService.updateWithdrawalRequest(
      id,
      updateAbleData
    );

    sendResponse<WithdrawalRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'WithdrawalRequest Updated successfully!',
      data: result,
    });
  }
);
const deleteWithdrawalRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await WithdrawalRequestService.deleteWithdrawalRequest(id);

    sendResponse<WithdrawalRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'WithdrawalRequest deleted successfully!',
      data: result,
    });
  }
);

export const WithdrawalRequestController = {
  getAllWithdrawalRequest,
  createWithdrawalRequest,
  updateWithdrawalRequest,
  getSingleWithdrawalRequest,
  deleteWithdrawalRequest,
  getSingleUserWithdrawalRequest,
  getWithdrawalBank,
};
