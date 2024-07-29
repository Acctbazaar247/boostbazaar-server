import { Message } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { messageFilterAbleFields } from './message.constant';
import { MessageService } from './message.service';
const createMessage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const MessageData = req.body;
    const user = req.user as JwtPayload;
    const result = await MessageService.createMessage({
      ...MessageData,
      sendById: user.userId,
    });
    sendResponse<Message>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Message Created successfully!',
      data: result,
    });
  }
);

const getAllMessage = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...messageFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);
  const user = req.user as JwtPayload;
  if (!filters.orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Provide orderId');
  }
  const result = await MessageService.getAllMessage(
    filters,
    paginationOptions,
    filters.chatGroupId as string,
    user.userId
  );

  sendResponse<Message[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleMessage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await MessageService.getSingleMessage(id);

    sendResponse<Message>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Message retrieved  successfully!',
      data: result,
    });
  }
);

const updateMessage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await MessageService.updateMessage(id, updateAbleData);

    sendResponse<Message>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Message Updated successfully!',
      data: result,
    });
  }
);
const deleteMessage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await MessageService.deleteMessage(id);

    sendResponse<Message>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Message deleted successfully!',
      data: result,
    });
  }
);

export const MessageController = {
  getAllMessage,
  createMessage,
  updateMessage,
  getSingleMessage,
  deleteMessage,
};
