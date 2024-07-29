import { Currency } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { currencyFilterAbleFields } from './currency.constant';
import { CurrencyService } from './currency.service';
const createCurrency: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyData = req.body;

    const result = await CurrencyService.createCurrency(CurrencyData);
    sendResponse<Currency>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Currency Created successfully!',
      data: result,
    });
  }
);

const getAllCurrency = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...currencyFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CurrencyService.getAllCurrency(
    filters,
    paginationOptions
  );

  sendResponse<Currency[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Currency retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCurrency: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CurrencyService.getSingleCurrency(id);

    sendResponse<Currency>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Currency retrieved  successfully!',
      data: result,
    });
  }
);

const getSingleCurrencyByUserId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;

    const result = await CurrencyService.getSingleCurrencyByUserId(user.userId);

    sendResponse<Currency>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Currency retrieved  successfully!',
      data: result,
    });
  }
);

const updateCurrency: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await CurrencyService.updateCurrency(id, updateAbleData);

    sendResponse<Currency>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Currency Updated successfully!',
      data: result,
    });
  }
);
const deleteCurrency: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CurrencyService.deleteCurrency(id);

    sendResponse<Currency>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Currency deleted successfully!',
      data: result,
    });
  }
);

export const CurrencyController = {
  getAllCurrency,
  createCurrency,
  updateCurrency,
  getSingleCurrency,
  deleteCurrency,
  getSingleCurrencyByUserId,
};
