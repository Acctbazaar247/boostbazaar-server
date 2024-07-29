import { Plan } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { planFilterAbleFields } from './plan.constant';
import { IBasicPlan, IPlanUploadCount } from './plan.interface';
import { PlanService } from './plan.service';
const createPlan: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const PlanData = req.body;
    const user = req.user as JwtPayload;

    const result = await PlanService.createPlan(PlanData, user.userId);
    sendResponse<Plan>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan Created successfully!',
      data: result,
    });
  }
);

const getAllPlan = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...planFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PlanService.getAllPlan(filters, paginationOptions);

  sendResponse<Plan[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Plan retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePlan: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PlanService.getSinglePlan(id);

    sendResponse<Plan>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan retrieved  successfully!',
      data: result,
    });
  }
);

const getActivePlan: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;

    const result = await PlanService.getActivePlan(user.userId);

    sendResponse<Plan | IBasicPlan>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan retrieved  successfully!',
      data: result,
    });
  }
);
const getHowManyUploadLeft: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;

    const result = await PlanService.getHowManyUploadLeft(user.userId);

    sendResponse<IPlanUploadCount>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan count retrieved  successfully!',
      data: result,
    });
  }
);

const updatePlan: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await PlanService.updatePlan(id, updateAbleData);

    sendResponse<Plan>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan Updated successfully!',
      data: result,
    });
  }
);
const deletePlan: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PlanService.deletePlan(id);

    sendResponse<Plan>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan deleted successfully!',
      data: result,
    });
  }
);

export const PlanController = {
  getAllPlan,
  createPlan,
  updatePlan,
  getSinglePlan,
  deletePlan,
  getActivePlan,
  getHowManyUploadLeft,
};
