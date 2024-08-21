import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TService } from './service.interface';
import { ServiceService } from './service.service';
const getAllService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getAllService();

  sendResponse<TService[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service retrieved successfully !',
    data: result,
  });
});

export const ServiceController = {
  getAllService,
};
