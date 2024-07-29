import axios from 'axios';
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../errors/ApiError';

const nowPaymentChecker = async (payment_id: number) => {
  const nowPaymentsApiKey = config.nowPaymentApiKey || '';
  const defaultUrl = config.nowPaymentInvoiceUrl || '';
  const url = defaultUrl.replace('/invoice', '/payment');
  const outputUrl = url + '/' + payment_id;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const ouputof = await axios.get(outputUrl, {
      headers: {
        'x-api-key': nowPaymentsApiKey,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

export default nowPaymentChecker;
