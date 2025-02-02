import { CryptoBank } from '@prisma/client';
          import { Request, Response } from 'express';
          import { RequestHandler } from 'express-serve-static-core';
          import httpStatus from 'http-status';
          import { paginationFields } from '../../../constants/pagination';
          import catchAsync from '../../../shared/catchAsync';
          import pick from '../../../shared/pick';
          import sendResponse from '../../../shared/sendResponse';
          import { CryptoBankService } from './cryptoBank.service';
          import { cryptoBankFilterAbleFields } from './cryptoBank.constant';
          const createCryptoBank: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const CryptoBankData = req.body;
          
              const result = await CryptoBankService.createCryptoBank(
                CryptoBankData
              );
              sendResponse<CryptoBank>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'CryptoBank Created successfully!',
                data: result,
              });
            }
          );
          
          
  const getAllCryptoBank = catchAsync(
            async (req: Request, res: Response) => {
              const filters = pick(req.query, [
                'searchTerm',
                ...cryptoBankFilterAbleFields,
              ]);
              const paginationOptions = pick(req.query, paginationFields);
          
              const result = await CryptoBankService.getAllCryptoBank(
                filters,
                paginationOptions
              );
          
              sendResponse<CryptoBank[]>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'CryptoBank retrieved successfully !',
                meta: result.meta,
                data: result.data,
              });
            }
          );
  
          
          const getSingleCryptoBank: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const id = req.params.id;
          
              const result = await CryptoBankService.getSingleCryptoBank(id);
          
              sendResponse<CryptoBank>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'CryptoBank retrieved  successfully!',
                data: result,
              });
            }
          );
          
          const updateCryptoBank: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const id = req.params.id;
              const updateAbleData = req.body;
          
              const result = await CryptoBankService.updateCryptoBank(
                id,
                updateAbleData
              );
          
              sendResponse<CryptoBank>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'CryptoBank Updated successfully!',
                data: result,
              });
            }
          );
          const deleteCryptoBank: RequestHandler = catchAsync(
            async (req: Request, res: Response) => {
              const id = req.params.id;
          
              const result = await CryptoBankService.deleteCryptoBank(id);
          
              sendResponse<CryptoBank>(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'CryptoBank deleted successfully!',
                data: result,
              });
            }
          );
          
          export const CryptoBankController = {
            getAllCryptoBank,
            createCryptoBank,
            updateCryptoBank,
            getSingleCryptoBank,
            deleteCryptoBank,
          };