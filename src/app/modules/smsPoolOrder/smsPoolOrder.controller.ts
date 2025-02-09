import { SmsPoolOrder } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { smsPoolOrderFilterAbleFields } from './smsPoolOrder.constant';
import { ISmsPoolOrderDetails } from './smsPoolOrder.interface';
import { SmsPoolOrderService } from './smsPoolOrder.service';
const createSmsPoolOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const SmsPoolOrderData = req.body;

    const result = await SmsPoolOrderService.createSmsPoolOrder(
      SmsPoolOrderData
    );
    sendResponse<SmsPoolOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SmsPoolOrder Created successfully!',
      data: result,
    });
  }
);

const getAllSmsPoolOrder = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    ...smsPoolOrderFilterAbleFields,
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SmsPoolOrderService.getAllSmsPoolOrder(
    filters,
    paginationOptions
  );

  sendResponse<SmsPoolOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SmsPoolOrder retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSmsPoolOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req.user as JwtPayload;
    const result = await SmsPoolOrderService.getSingleSmsPoolOrder(
      id,
      user.userId
    );
    sendResponse<ISmsPoolOrderDetails>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SmsPoolOrder retrieved  successfully!',
      data: result,
    });
  }
);

const updateSmsPoolOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user as JwtPayload;
    const result = await SmsPoolOrderService.updateSmsPoolOrder(
      id,
      updateAbleData,
      user.userId
    );

    sendResponse<SmsPoolOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SmsPoolOrder Updated successfully!',
      data: result,
    });
  }
);
const updateSmsPoolOrderStatus: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user as JwtPayload;
    const result = await SmsPoolOrderService.updateSmsPoolOrderStatus(
      id,
      updateAbleData,
      user.userId
    );

    sendResponse<SmsPoolOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SmsPoolOrder Updated successfully!',
      data: result,
    });
  }
);
const deleteSmsPoolOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await SmsPoolOrderService.deleteSmsPoolOrder(id);

    sendResponse<SmsPoolOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SmsPoolOrder deleted successfully!',
      data: result,
    });
  }
);

export const SmsPoolOrderController = {
  getAllSmsPoolOrder,
  createSmsPoolOrder,
  updateSmsPoolOrder,
  getSingleSmsPoolOrder,
  deleteSmsPoolOrder,
  updateSmsPoolOrderStatus,
};
