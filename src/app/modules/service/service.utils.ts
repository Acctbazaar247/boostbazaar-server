import axios from 'axios';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

async function createOrder(
  serviceId: string,
  link: string,
  quantity: number
): Promise<null | string> {
  const response = await axios.post(config.japUrl, {
    key: config.japApiKey,
    action: 'add',
    service: serviceId,
    link: link,
    quantity: quantity,
  });

  if (response.data.error) {
    console.log('Error:', response.data.error);
    throw new ApiError(httpStatus.BAD_REQUEST, response.data.error);
  } else {
    console.log('Order ID:', response.data.order);
    return response.data.order;
  }
}
export default createOrder;
