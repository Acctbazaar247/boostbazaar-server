import { EReferralStatus, EStatusOfCurrencyRequest } from '@prisma/client';
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../errors/ApiError';
import EmailTemplates from '../shared/EmailTemplates';
import prisma from '../shared/prisma';
import sendEmail from './sendEmail';
import sendNotification from './sendNotification';

const UpdateCurrencyByRequestAfterPay = async (data: {
  order_id: string;
  payment_status: string;
  price_amount: number;
}) => {
  try {
    let userId: string = '';
    const isCurrencyRequestExits = await prisma.currencyRequest.findUnique({
      where: { id: data.order_id },
    });
    if (!isCurrencyRequestExits) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
    }
    userId = isCurrencyRequestExits.ownById;
    // user previous currency
    const isUserCurrencyExist = await prisma.currency.findUnique({
      where: { ownById: isCurrencyRequestExits.ownById },
    });
    if (!isUserCurrencyExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Currency not found!');
    }

    // check does user has any referral by another people,
    const isReferralExist = await prisma.referral.findUnique({
      where: {
        ownById: isCurrencyRequestExits.ownById,
        status: EReferralStatus.pending,
      },
    });

    await prisma.$transaction(async tx => {
      // check is request exits

      // change status to approved
      if (isCurrencyRequestExits.status === EStatusOfCurrencyRequest.pending) {
        //
        await tx.currencyRequest.update({
          where: { id: data.order_id },
          data: {
            status: EStatusOfCurrencyRequest.approved,
            paymentStatus: data.payment_status,
          },
        });
        // add money to user

        // check ref
        const isAddedSameAmount =
          config.referralFirstPayAmount <= data.price_amount;
        if (isReferralExist) {
          // check the a
          // update referred by user

          if (isAddedSameAmount) {
            await tx.currency.update({
              where: { ownById: isReferralExist.referralById },
              data: { amount: { increment: config.referralAmount } },
            });
            await tx.referral.update({
              where: { id: isReferralExist.id },
              data: {
                status: EReferralStatus.completed,
              },
            });
          } else {
            await tx.referral.update({
              where: { id: isReferralExist.id },
              data: {
                status: EReferralStatus.cancel,
              },
            });
          }
        }
        await tx.currency.update({
          where: { ownById: isCurrencyRequestExits.ownById },
          data: {
            amount: {
              increment: data.price_amount,
            },
          },
        });
      }
    });
    if (userId.length) {
      await sendNotification({
        title: 'Deposit',
        message: `You deposited ${data.price_amount} into your account `,
        ownById: userId,
        link: `/account/wallet`,
      });
    }
  } catch (err) {
    await sendEmail(
      { to: config.emailUser || '' },
      {
        subject: EmailTemplates.currencyRequestPaymentSuccessButFailed.subject,
        html: EmailTemplates.currencyRequestPaymentSuccessButFailed.html({
          failedSavedData: JSON.stringify(data),
        }),
      }
    );
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went worg');
  }
};
export default UpdateCurrencyByRequestAfterPay;
