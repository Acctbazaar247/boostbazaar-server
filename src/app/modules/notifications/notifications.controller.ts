import { Notifications, Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NotificationsService } from './notifications.service';
const createNotifications: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const NotificationsData = req.body;

    const result = await NotificationsService.createNotifications(
      NotificationsData
    );
    sendResponse<Notifications>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Notifications Created successfully!',
      data: result,
    });
  }
);

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await NotificationsService.getAllNotifications(user.userId);

  sendResponse<Notifications[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully !',
    data: result,
  });
});

const getSingleNotifications: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await NotificationsService.getSingleNotifications(id);

    sendResponse<Notifications>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Notifications retrieved  successfully!',
      data: result,
    });
  }
);

const updateNotifications: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;

    const result = await NotificationsService.updateNotifications(user.userId);

    sendResponse<Prisma.BatchPayload>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Notifications Updated successfully!',
      data: result,
    });
  }
);
const deleteNotifications: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await NotificationsService.deleteNotifications(id);

    sendResponse<Notifications>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Notifications deleted successfully!',
      data: result,
    });
  }
);

export const NotificationsController = {
  getAllNotifications,
  createNotifications,
  updateNotifications,
  getSingleNotifications,
  deleteNotifications,
};
