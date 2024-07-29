import { Referral } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { ReferralService } from './referral.service';
        import { referralFilterAbleFields } from './referral.constant';
        const createReferral: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const ReferralData = req.body;
        
            const result = await ReferralService.createReferral(
              ReferralData
            );
            sendResponse<Referral>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Referral Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllReferral = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...referralFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await ReferralService.getAllReferral(
              filters,
              paginationOptions
            );
        
            sendResponse<Referral[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Referral retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleReferral: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await ReferralService.getSingleReferral(id);
        
            sendResponse<Referral>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Referral retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateReferral: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await ReferralService.updateReferral(
              id,
              updateAbleData
            );
        
            sendResponse<Referral>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Referral Updated successfully!',
              data: result,
            });
          }
        );
        const deleteReferral: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await ReferralService.deleteReferral(id);
        
            sendResponse<Referral>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Referral deleted successfully!',
              data: result,
            });
          }
        );
        
        export const ReferralController = {
          getAllReferral,
          createReferral,
          updateReferral,
          getSingleReferral,
          deleteReferral,
        };