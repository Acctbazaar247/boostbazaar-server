import { EStatusOfKyc, Kyc } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { kycFilterAbleFields } from './kyc.constant';
import { KycService } from './kyc.service';
const createKyc: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const KycData = req.body;
    const user = req.user as JwtPayload;
    const result = await KycService.createKyc({
      ...KycData,
      ownById: user.userId,
      status: EStatusOfKyc.pending,
    });
    sendResponse<Kyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Kyc Created successfully!',
      data: result,
    });
  }
);

const getAllKyc = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...kycFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await KycService.getAllKyc(filters, paginationOptions);

  sendResponse<Kyc[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Kyc retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleKyc: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await KycService.getSingleKyc(id);

    sendResponse<Kyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Kyc retrieved  successfully!',
      data: result,
    });
  }
);
const getSingleKycOfUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;

    const result = await KycService.getSingleKycOfUser(user.userId);

    sendResponse<Kyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Kyc retrieved successfully!',
      data: result,
    });
  }
);

const updateKyc: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user as JwtPayload;

    const result = await KycService.updateKyc(id, updateAbleData, user.userId);

    sendResponse<Kyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Kyc Updated successfully!',
      data: result,
    });
  }
);
const deleteKyc: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await KycService.deleteKyc(id);

    sendResponse<Kyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Kyc deleted successfully!',
      data: result,
    });
  }
);

export const KycController = {
  getAllKyc,
  createKyc,
  updateKyc,
  getSingleKyc,
  deleteKyc,
  getSingleKycOfUser,
};
