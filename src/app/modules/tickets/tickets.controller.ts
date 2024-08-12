import { Tickets } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { ticketsFilterAbleFields } from './tickets.constant';
import { TicketsService } from './tickets.service';
const createTickets: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const TicketsData = req.body;
    const user = req.user as JwtPayload;
    const result = await TicketsService.createTickets({
      ...TicketsData,
      ownById: user.userId,
    });
    sendResponse<Tickets>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tickets Created successfully!',
      data: result,
    });
  }
);

const getAllTickets = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...ticketsFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TicketsService.getAllTickets(filters, paginationOptions);

  sendResponse<Tickets[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tickets retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTickets: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await TicketsService.getSingleTickets(id);

    sendResponse<Tickets>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tickets retrieved  successfully!',
      data: result,
    });
  }
);

const updateTickets: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await TicketsService.updateTickets(id, updateAbleData);

    sendResponse<Tickets>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tickets Updated successfully!',
      data: result,
    });
  }
);
const deleteTickets: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await TicketsService.deleteTickets(id);

    sendResponse<Tickets>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tickets deleted successfully!',
      data: result,
    });
  }
);

export const TicketsController = {
  getAllTickets,
  createTickets,
  updateTickets,
  getSingleTickets,
  deleteTickets,
};
