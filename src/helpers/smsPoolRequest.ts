import axios from 'axios';
import FormData from 'form-data';
import config from '../config';
// const demoOrderResponse = {
//   success: 1,
//   number: 1234567890,
//   cc: '1',
//   phonenumber: '234567890',
//   order_id: 'ABCDEFGH',
//   country: 'United States',
//   service: 'Service',
//   pool: 1,
//   expires_in: 1200,
//   expiration: 1705309968,
//   message:
//     'You have succesfully ordered a Service number from pool: Foxtrot for 0.24.',
//   cost: '0.24',
//   cost_in_cents: 24,
// };
type IOrderResponse = {
  success: number;
  number: number;
  cc: string;
  phonenumber: string;
  order_id: string;
  country: string;
  service: string;
  pool: number;
  expires_in: number;
  expiration: number;
  message: string;
  cost: string;
  cost_in_cents: number;
};
export type IOrderHistory = {
  cost: string;
  order_code: string;
  phonenumber: string;
  cc: string;
  number: string;
  code: string;
  full_code: string;
  short_name: string;
  service: string;
  status: string;
  pool_name: string;
  pool: number;
  timestamp: string;
  completed_on: string;
  expiry: number;
  time_left: number;
};
const makeOrderRequest = async ({
  serviceId,
  countryId,
}: {
  serviceId: string;
  countryId: string;
}): Promise<IOrderResponse> => {
  const data = new FormData();
  data.append('key', config.smsPoolApiKey);
  data.append('country', countryId);
  data.append('service', serviceId);
  //   data.append('pool', '');
  //   data.append('max_price', '');
  //   data.append('pricing_option', '');
  data.append('quantity', '1');
  //   data.append('areacode', '');
  //   data.append('exclude', '');
  //   data.append('create_token', '');

  const axiosConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.smspool.net/purchase/sms',
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  const response = await axios(axiosConfig);
  return response.data;
};

const getOrderStatus = async (orderId: string) => {};

// fetch all service
const allService = async () => {
  // fetch to
  const data = new FormData();
  const config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: 'https://api.smspool.net/service/retrieve_all',
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };
  const response = await axios(config);
  return response.data;
};

const getAllOrderHistory = async ({
  orderId,
}: {
  orderId?: string;
}): Promise<IOrderHistory[]> => {
  const data = new FormData();
  data.append('key', config.smsPoolApiKey);
  if (orderId) {
    data.append('search', orderId);
  }
  const smsPoolHistoryConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.smspool.net/request/history',
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };
  const response = await axios(smsPoolHistoryConfig);
  return response.data;
};

const refundOrder = async ({ orderId }: { orderId: string }) => {
  const data = new FormData();
  data.append('key', config.smsPoolApiKey);
  data.append('orderid', orderId);
  console.log('provided order id', orderId);
  const smsPoolCancelConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.smspool.net/sms/cancel',
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };
  const response = await axios(smsPoolCancelConfig);
  return response.data;
};
export const smsPoolRequest = {
  makeOrderRequest,
  getOrderStatus,
  allService,
  getAllOrderHistory,
  refundOrder,
};
