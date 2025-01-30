import { SmsPoolOrder } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TSmsPoolService, TSmsPoolServiceCountry } from './smsPool.interface';
import { SmsPoolService } from './smsPool.service';

// const createSmsPool: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const SmsPoolData = req.body;

//     const result = await SmsPoolService.createSmsPool(SmsPoolData);
//     sendResponse<SmsPool>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'SmsPool Created successfully!',
//       data: result,
//     });
//   }
// );
const createSmsPoolOrder = catchAsync(async (req: Request, res: Response) => {
  const SmsPoolOrderData = req.body;
  const user = req.user as JwtPayload;
  const result = await SmsPoolService.createSmsPoolOrder({
    ...SmsPoolOrderData,
    orderById: user.userId,
  });
  sendResponse<SmsPoolOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SmsPoolOrder Created successfully!',
    data: result,
  });
});
const getAllSmsPoolService = catchAsync(async (req: Request, res: Response) => {
  const result = await SmsPoolService.getAllSmsPool();

  sendResponse<TSmsPoolService[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SmsPool retrieved successfully !',
    data: result,
  });
});

const getSingleSmsPool: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await SmsPoolService.getSingleSmsPoolServiceCountry(id);

    sendResponse<TSmsPoolServiceCountry[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SmsPool retrieved  successfully!',
      data: result,
    });
  }
);

export const SmsPoolController = {
  getAllSmsPoolService,
  getSingleSmsPool,
  createSmsPoolOrder,
};
