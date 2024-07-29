import { Account, EApprovedForSale, Prisma, UserRole } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import { accountCategoryToType } from '../../../helpers/getAccountCategoryToType';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import {
  accountFilterAbleFields,
  accountFilterByPrice,
} from './account.constant';
import { AccountService } from './account.service';
const createAccount: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const AccountData = req.body as Account;
    const user = req.user as JwtPayload;
    let result = null;

    const accountType = accountCategoryToType(AccountData.category);
    if (user.role === UserRole.admin || user.role === UserRole.superAdmin) {
      result = await AccountService.createAccount({
        ...AccountData,
        ownById: user.userId,
        approvedForSale: EApprovedForSale.approved,
        accountType,
      });

      // await sendEmailToEveryOne({
      //   accountName: result?.name || '',
      //   category: result?.category || '',
      //   description: result?.description || '',
      //   price: result?.price || 0,
      //   without: [config.mainAdminEmail as string],
      // });
    } else {
      result = await AccountService.createAccount({
        ...AccountData,
        ownById: user.userId,
        approvedForSale: EApprovedForSale.pending,
        accountType,
      });
    }
    sendResponse<Account>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Account Created successfully!',
      data: result,
    });
  }
);
const createAccountMultiple: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const AccountDatas = req.body as Account[];
    const user = req.user as JwtPayload;

    // const accountType = accountCategoryToType(AccountData.category);
    const withUserIdAndAccountType = AccountDatas.map(single => ({
      ...single,
      accountType: accountCategoryToType(single.category),
      ownById: user.userId,
      approvedForSale: EApprovedForSale.pending,
    }));
    const result = await AccountService.createAccountMultiple(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      withUserIdAndAccountType as any
    );
    sendResponse<Prisma.BatchPayload>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Account Created successfully!',
      data: result,
    });
  }
);

const getAllAccount = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    ...accountFilterAbleFields,
    ...accountFilterByPrice,
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AccountService.getAllAccount(filters, paginationOptions);

  sendResponse<
    Omit<
      Account,
      | 'username'
      | 'password'
      | 'additionalEmail'
      | 'additionalPassword'
      | 'additionalDescription'
      | 'additionalImage'
    >[]
  >(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAccount: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await AccountService.getSingleAccount(id);

    sendResponse<Account>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Account retrieved  successfully!',
      data: result,
    });
  }
);

const updateAccount: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user as JwtPayload;
    const result = await AccountService.updateAccount(id, updateAbleData, {
      id: user.userId,
      role: user.role,
    });

    sendResponse<Omit<Account, 'username' | 'password'>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Account Updated successfully!',
      data: result,
    });
  }
);
const deleteAccount: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await AccountService.deleteAccount(id);

    sendResponse<Omit<Account, 'username' | 'password'>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Account deleted successfully!',
      data: result,
    });
  }
);

export const AccountController = {
  getAllAccount,
  createAccount,
  updateAccount,
  getSingleAccount,
  deleteAccount,
  createAccountMultiple,
};
