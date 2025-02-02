import { Bank } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bankFilterAbleFields } from './bank.constant';
import { BankService } from './bank.service';
const createBank: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const BankData = req.body;

    const result = await BankService.createBank({
      ...BankData,
      isActive: true,
    });
    sendResponse<Bank>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bank Created successfully!',
      data: result,
    });
  }
);

const getAllBank = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...bankFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BankService.getAllBank(filters, paginationOptions);

  sendResponse<Bank[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bank retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBank: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BankService.getSingleBank(id);

    sendResponse<Bank>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bank retrieved  successfully!',
      data: result,
    });
  }
);

const updateBank: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await BankService.updateBank(id, updateAbleData);

    sendResponse<Bank>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bank Updated successfully!',
      data: result,
    });
  }
);
const deleteBank: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BankService.deleteBank(id);

    sendResponse<Bank>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bank deleted successfully!',
      data: result,
    });
  }
);

export const BankController = {
  getAllBank,
  createBank,
  updateBank,
  getSingleBank,
  deleteBank,
};
