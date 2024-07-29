import { Cart } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { cartFilterAbleFields } from './cart.constant';
import { CartService } from './cart.service';
const createCart: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CartData = req.body;
    const requestBy = req.user as JwtPayload;

    const result = await CartService.createCart(requestBy.userId, {
      ...CartData,
      ownById: requestBy.userId,
    });
    sendResponse<Cart>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cart Created successfully!',
      data: result,
    });
  }
);

const getAllCart = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...cartFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CartService.getAllCart(filters, paginationOptions);

  sendResponse<Cart[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCart: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CartService.getSingleCart(id);

    sendResponse<Cart>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cart retrieved  successfully!',
      data: result,
    });
  }
);
const getSingleUserCarts: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;

    const result = await CartService.getSingleUserCarts(user.userId);

    sendResponse<Cart[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cart retrieved  successfully!',
      data: result,
    });
  }
);

const updateCart: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await CartService.updateCart(id, updateAbleData);

    sendResponse<Cart>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cart Updated successfully!',
      data: result,
    });
  }
);
const deleteCart: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CartService.deleteCart(id);

    sendResponse<Cart>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cart deleted successfully!',
      data: result,
    });
  }
);

export const CartController = {
  getAllCart,
  createCart,
  updateCart,
  getSingleCart,
  deleteCart,
  getSingleUserCarts,
};
