import { CurrencyRequest } from '@prisma/client';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import flutterwavePaymentChecker from '../../../helpers/flutterwavePaymentChecker';
import sendEmail from '../../../helpers/sendEmail';
import { EPaymentType } from '../../../interfaces/common';
import EmailTemplates from '../../../shared/EmailTemplates';
import catchAsync from '../../../shared/catchAsync';
import catchAsyncSemaphore from '../../../shared/catchAsyncSemaphore';
import pick from '../../../shared/pick';
import prisma from '../../../shared/prisma';
import sendResponse from '../../../shared/sendResponse';
import { currencyRequestFilterAbleFields } from './currencyRequest.constant';
import {
  EOxWebhookStatus,
  KoraPayEvent,
  TKoraPayWebhookResponse,
  TOXWebhookResponse,
} from './currencyRequest.interface';
import { CurrencyRequestService } from './currencyRequest.service';
const createCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyRequestData = req.body;
    const user = req.user as JwtPayload;

    const userInfo = await prisma.user.findFirst({
      where: { id: user.userId },
    });

    const result = await CurrencyRequestService.createCurrencyRequest({
      ...CurrencyRequestData,
      ownById: user.userId,
    });
    await sendEmail(
      { to: config.emailUser as string },
      {
        subject: EmailTemplates.requestForCurrencyToAdmin.subject,
        html: EmailTemplates.requestForCurrencyToAdmin.html({
          amount: result?.amount,
          userEmail: userInfo?.email,
          userName: userInfo?.name,
          userProfileImg: userInfo?.profileImg || '',
        }),
      }
    );
    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Created successfully!',
      data: result,
    });
  }
);
const createCurrencyRequestInvoice: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyRequestData = req.body;
    const user = req.user as JwtPayload;

    // const userInfo = await prisma.user.findFirst({
    //   where: { id: user.userId },
    // });

    const result = await CurrencyRequestService.createCurrencyRequestInvoice({
      ...CurrencyRequestData,
      ownById: user.userId,
    });
    // await sendEmail(
    //   { to: config.emailUser as string },
    //   {
    //     subject: EmailTemplates.requestForCurrencyToAdmin.subject,
    //     html: EmailTemplates.requestForCurrencyToAdmin.html({
    //       amount: result?.amount,
    //       userEmail: userInfo?.email,
    //       userName: userInfo?.name,
    //       userProfileImg: userInfo?.profileImg || '',
    //     }),
    //   }
    // );
    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Created successfully!',
      data: result,
    });
  }
);
const createCurrencyRequestWithPayStack: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyRequestData = req.body;
    const user = req.user as JwtPayload;

    const result =
      await CurrencyRequestService.createCurrencyRequestWithPayStack({
        ...CurrencyRequestData,
        ownById: user.userId,
      });
    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Created successfully!',
      data: result,
    });
  }
);
const createCurrencyRequestWithFlutterwave: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyRequestData = req.body;
    const user = req.user as JwtPayload;

    const result =
      await CurrencyRequestService.createCurrencyRequestWithFlutterwave({
        ...CurrencyRequestData,
        ownById: user.userId,
      });
    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Created successfully!',
      data: result,
    });
  }
);

const getAllCurrencyRequest = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, [
      'searchTerm',
      ...currencyRequestFilterAbleFields,
    ]);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await CurrencyRequestService.getAllCurrencyRequest(
      filters,
      paginationOptions
    );

    sendResponse<CurrencyRequest[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved successfully !',
      meta: result.meta,
      data: result.data,
    });
  }
);

const payStackWebHook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ipnData = req.body;
    if (ipnData.event === 'charge.success') {
      await CurrencyRequestService.payStackWebHook({
        data: ipnData,
      });
    }
    // eslint-disable-next-line no-console
    // console.log(ipnData);
    // eslint-disable-next-line no-unused-vars

    sendResponse<string>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved  successfully!',
      data: 'success',
    });
  }
);
const createCurrencyRequestWithKoraPay: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyRequestData = req.body;
    const user = req.user as JwtPayload;

    const result =
      await CurrencyRequestService.createCurrencyRequestWithKoraPay({
        ...CurrencyRequestData,
        ownById: user.userId,
      });
    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Created successfully!',
      data: result,
    });
  }
);
const createCurrencyRequestWithOxProcess: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyRequestData = req.body;
    const user = req.user as JwtPayload;

    const result =
      await CurrencyRequestService.createCurrencyRequestWithOxProcess({
        ...CurrencyRequestData,
        ownById: user.userId,
      });
    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Created successfully!',
      data: result,
    });
  }
);
const flutterwaveWebHook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ipnData = req.body;
    console.log({ ipnData });
    await flutterwavePaymentChecker(ipnData.data.tx_ref);
    if (
      ipnData.event === 'charge.completed' &&
      ipnData.data.status === 'successful'
    ) {
      await CurrencyRequestService.flutterwaveWebHook({
        data: ipnData.data,
      });
    }
    // eslint-disable-next-line no-console
    // console.log(ipnData);
    // eslint-disable-next-line no-unused-vars

    sendResponse<string>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved  successfully!',
      data: 'message',
    });
  }
);
const createCurrencyRequestIpn: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ipnData = req.body;

    // eslint-disable-next-line no-unused-vars
    await CurrencyRequestService.createCurrencyRequestIpn(ipnData);

    sendResponse<string>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved  successfully!',
      data: 'succes',
    });
  }
);

const koraPayWebHook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // const secretHash = config.flutterwave_hash;
    // const signature = req.headers['verif-hash'];
    // if (!signature || signature !== secretHash) {
    //   // This request isn't from Flutterwave; discard
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     'Only allowed from flutterwave'
    //   );
    // }
    const hash = crypto
      .createHmac('sha256', config.koraApiSecretKey)
      .update(JSON.stringify(req.body.data))
      .digest('hex');

    if (hash !== req.headers['x-korapay-signature']) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Only allowed from kora pay');
    }
    const ipnData = req.body as TKoraPayWebhookResponse;
    console.log({ ipnData }, 'webhook kora pay');
    if (ipnData.event === KoraPayEvent.PAYMENT_SUCCESS) {
      console.log('kora pay succss');
      if (ipnData.data.status === 'success') {
        // const paymentReference = ipnData.data.reference;

        // Perform additional actions, such as updating your database, sending emails, etc.
        const paymentType = ipnData?.data.reference.split('__')[0];
        if (paymentType === EPaymentType.addFunds) {
          await CurrencyRequestService.koraPayWebHook({
            ...ipnData,
          });
        } else if (paymentType === EPaymentType.seller) {
          // await UpdateSellerAfterPay({
          //   order_id: ipnData?.data.reference.split('__')[1],
          //   payment_status: 'finished',
          //   price_amount: config.sellerOneTimePayment,
          // });
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log({ ipnData }, 'webhook');
    // eslint-disable-next-line no-unused-vars

    sendResponse<string>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved  successfully!',
      data: 'success',
    });
  }
);

const getSingleCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CurrencyRequestService.getSingleCurrencyRequest(id);

    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved  successfully!',
      data: result,
    });
  }
);

const OxWebHook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    console.log('revcive OX webhook ---- and now checking');
    // const secretHash = config.flutterwave_hash;
    // const signature = req.headers['verif-hash'];
    // if (!signature || signature !== secretHash) {
    //   // This request isn't from Flutterwave; discard
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     'Only allowed from flutterwave'
    //   );
    // }
    const ipnData = req.body as TOXWebhookResponse;
    const WEBHOOK_PASSWORD = config.oxProcessingWebHookPassword;
    const { PaymentId, MerchantId, Email, Currency, Signature } = req.body;

    // Check that all required fields exist
    if (!PaymentId || !MerchantId || !Email || !Currency || !Signature) {
      console.error('Missing required parameters for signature verification.');
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Only allowed from oxProcessing'
      );
    }
    const dataString = `${PaymentId}:${MerchantId}:${Email}:${Currency}:${WEBHOOK_PASSWORD}`;
    console.log('Data string to hash:', dataString);

    // Compute the MD5 hash of the string
    const computedHash = crypto
      .createHash('md5')
      .update(dataString)
      .digest('hex');
    console.log('Computed hash:', computedHash);
    console.log('Received signature:', Signature);

    // Compare the computed hash with the signature from the request
    console.log(computedHash === Signature, 'this is the result of comparison');
    // break if not same
    if (computedHash !== Signature) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Only allowed from oxProcessing'
      );
    }
    console.log({ ipnData }, 'webhook');
    if (ipnData.Status === EOxWebhookStatus.Success) {
      // const paymentReference = ipnData.data.reference;
      console.log('i am in webhook inner', ipnData);
      // Perform additional actions, such as updating your database, sending emails, etc.
      const paymentType = ipnData?.BillingID.split('__')[0];
      if (paymentType === EPaymentType.addFunds) {
        await CurrencyRequestService.OxWebHook(ipnData);
      }
    }

    sendResponse<string>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved  successfully!',
      data: 'success',
    });
  }
);

const updateCurrencyRequest: RequestHandler = catchAsyncSemaphore(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = await CurrencyRequestService.updateCurrencyRequest(
      id,
      updateAbleData
    );

    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Updated successfully!',
      data: result,
    });
  }
);
const deleteCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CurrencyRequestService.deleteCurrencyRequest(id);

    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest deleted successfully!',
      data: result,
    });
  }
);

export const CurrencyRequestController = {
  getAllCurrencyRequest,
  createCurrencyRequest,
  updateCurrencyRequest,
  getSingleCurrencyRequest,
  deleteCurrencyRequest,
  createCurrencyRequestInvoice,
  createCurrencyRequestIpn,
  createCurrencyRequestWithPayStack,
  payStackWebHook,
  createCurrencyRequestWithFlutterwave,
  flutterwaveWebHook,
  createCurrencyRequestWithKoraPay,
  koraPayWebHook,
  createCurrencyRequestWithOxProcess,
  OxWebHook,
};
