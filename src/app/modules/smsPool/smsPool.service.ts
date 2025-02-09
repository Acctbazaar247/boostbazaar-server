import { SmsPoolOrder } from '@prisma/client';
import axios from 'axios';
import FormData from 'form-data';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import sendEmail from '../../../helpers/sendEmail';
import { smsPoolRequest } from '../../../helpers/smsPoolRequest';
import EmailTemplates from '../../../shared/EmailTemplates';
import prisma from '../../../shared/prisma';
import {
  TSmsPoolOrderHistory,
  TSmsPoolService,
  TSmsPoolServiceCountry,
} from './smsPool.interface';

const getAllSmsPool = async (): Promise<TSmsPoolService[]> => {
  return smsPoolRequest.allService();
};
// const countrySuccess = async (): Promise<TSmsPoolService | null> => {
//   const newSmsPool = await prisma.smsPool.create({
//     data: payload,
//   });
//   return newSmsPool;
// };
// create sms pool order

const getSingleSmsPoolServiceCountry = async (
  id: string
): Promise<TSmsPoolServiceCountry[]> => {
  const data = new FormData();
  data.append('service', id);
  const config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: 'https://api.smspool.net/request/success_rate',
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };
  const response = await axios(config);
  return response.data;
};

const createSmsPoolOrder = async (
  payload: SmsPoolOrder
): Promise<SmsPoolOrder | null> => {
  const services = await getSingleSmsPoolServiceCountry(payload.serviceId);
  if (!services.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Service not found');
  }
  const serviceIndex = services.findIndex(
    service => service.short_name === payload.countryId
  );
  if (serviceIndex === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Country not found');
  }
  const service = services[serviceIndex];
  const maxPrice = service.price;
  const orderById = payload.orderById;
  const user = await prisma.user.findUnique({
    where: {
      id: orderById,
    },
    include: {
      Currency: true,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (!user.Currency) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not have currency');
  }
  const userCurrency = user.Currency;
  const serviceCharge =
    parseFloat(maxPrice) * (config.smsPoolServiceChargeInPercentage / 100);
  const totalAmount = parseFloat(maxPrice) + serviceCharge;
  if (totalAmount > userCurrency.amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }
  // if user have enough balance then create sms pool order
  const adminInfo = await prisma.user.findUnique({
    where: {
      email: config.mainAdminEmail,
    },
    select: { id: true },
  });
  if (!adminInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not found');
  }
  const orderResponse = await smsPoolRequest.makeOrderRequest({
    serviceId: payload.serviceId,
    countryId: payload.countryId,
  });
  if (orderResponse.success === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to make order');
  }
  try {
    const newSmsPoolOrder = await prisma.$transaction(async tx => {
      // make order in sms pool api
      const smsConst = parseFloat(orderResponse.cost);
      const orderServiceCharge =
        config.smsPoolServiceChargeInPercentage * (smsConst / 100);
      console.log('Main cost in sms poool', smsConst);
      console.log('main service charge ', orderServiceCharge);
      const lastCost = parseFloat((smsConst + orderServiceCharge).toFixed(3));
      console.log('Main cost in our system', lastCost);

      const smsPoolOrder = await tx.smsPoolOrder.create({
        data: {
          ...payload,
          cost: lastCost,
          country: orderResponse.country,
          pool: orderResponse.pool.toString(),
          cc: orderResponse.cc,
          service: orderResponse.service,
          orderId: orderResponse.order_id,
          number: orderResponse.number.toString(),
          phoneNumber: orderResponse.phonenumber,
        },
      });

      // update admin currency
      await tx.currency.update({
        where: { ownById: adminInfo.id },
        data: {
          amount: {
            increment: lastCost,
          },
        },
      });
      const currency = await tx.currency.update({
        where: { id: userCurrency.id },
        data: {
          amount: {
            decrement: lastCost,
          },
        },
      });
      if (currency.amount < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
      }
      return smsPoolOrder;
    });
    return newSmsPoolOrder;
  } catch (error) {
    await sendEmail(
      { to: config.mainAdminEmail },
      {
        subject: 'Re-check sms pool order',
        html: EmailTemplates.reCheckSmsPoolOrder.html({
          email: user.email,
          orderId: orderResponse.order_id,
        }),
      }
    );
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};
const getAllOrderHistoryFromSmsPool = async (payload: {
  orderId?: string;
}): Promise<TSmsPoolOrderHistory[]> => {
  const smsPoolOrders = await smsPoolRequest.getAllOrderHistory(payload);
  return smsPoolOrders;
};

export const SmsPoolService = {
  getAllSmsPool,
  // createSmsPool,
  createSmsPoolOrder,
  getSingleSmsPoolServiceCountry,
  getAllOrderHistoryFromSmsPool,
};
