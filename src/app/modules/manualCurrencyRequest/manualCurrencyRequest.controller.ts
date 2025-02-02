import {
  EStatusOfManualCurrencyRequest,
  ManualCurrencyRequest,
} from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { manualCurrencyRequestFilterAbleFields } from './manualCurrencyRequest.constant';
import { ManualCurrencyRequestService } from './manualCurrencyRequest.service';
const createManualCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ManualCurrencyRequestData = req.body;
    // check is the provide both accountNumber and walletAddress
    if (
      ManualCurrencyRequestData.accountNumber &&
      ManualCurrencyRequestData.walletAddress
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You cannot provide both account number and wallet address'
      );
    }
    // add validation if accountNumber exits  then
    if (ManualCurrencyRequestData.accountNumber) {
      const requiredFields = ['bankId', 'bankName', 'accountName'];
      requiredFields.forEach(field => {
        if (!ManualCurrencyRequestData[field]) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `${field} is required when account number is provided`
          );
        }
      });
    } else if (ManualCurrencyRequestData.transactionHash) {
      const requiredFields = ['cryptoBankId'];
      requiredFields.forEach(field => {
        if (!ManualCurrencyRequestData[field]) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `${field} is required when using wallet`
          );
        }
      });
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Invalidate Data for Manual Currency Request'
      );
    }

    const user = req.user as JwtPayload;
    const result =
      await ManualCurrencyRequestService.createManualCurrencyRequest({
        ...ManualCurrencyRequestData,
        ownById: user.userId,
        status: EStatusOfManualCurrencyRequest.pending,
        dollarRate: config.manualDollarRate,
        receivedAmount: null,
      });
    sendResponse<ManualCurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'ManualCurrencyRequest Created successfully!',
      data: result,
    });
  }
);

const getAllManualCurrencyRequest = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, [
      'searchTerm',
      ...manualCurrencyRequestFilterAbleFields,
    ]);
    const paginationOptions = pick(req.query, paginationFields);

    const result =
      await ManualCurrencyRequestService.getAllManualCurrencyRequest(
        filters,
        paginationOptions
      );

    sendResponse<ManualCurrencyRequest[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'ManualCurrencyRequest retrieved successfully !',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleManualCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result =
      await ManualCurrencyRequestService.getSingleManualCurrencyRequest(id);

    sendResponse<ManualCurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'ManualCurrencyRequest retrieved  successfully!',
      data: result,
    });
  }
);

const updateManualCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;
    const validUpdateAbleDate: Partial<ManualCurrencyRequest> = {};

    const fields: (keyof Partial<ManualCurrencyRequest>)[] = [
      'status',
      'message',
      'receivedAmount',
    ];
    fields.forEach(field => {
      if (updateAbleData[field]) {
        validUpdateAbleDate[field] = updateAbleData[field];
      }
    });

    const result =
      await ManualCurrencyRequestService.updateManualCurrencyRequest(
        id,
        validUpdateAbleDate
      );

    sendResponse<ManualCurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'ManualCurrencyRequest Updated successfully!',
      data: result,
    });
  }
);
const deleteManualCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result =
      await ManualCurrencyRequestService.deleteManualCurrencyRequest(id);

    sendResponse<ManualCurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'ManualCurrencyRequest deleted successfully!',
      data: result,
    });
  }
);

export const ManualCurrencyRequestController = {
  getAllManualCurrencyRequest,
  createManualCurrencyRequest,
  updateManualCurrencyRequest,
  getSingleManualCurrencyRequest,
  deleteManualCurrencyRequest,
};
