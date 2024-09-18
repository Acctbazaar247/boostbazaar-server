import axios from 'axios';
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../errors/ApiError';

const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3/transactions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function flutterwavePaymentChecker(txRef: string): Promise<any> {
  try {
    const response = await axios.get(
      `${FLUTTERWAVE_API_URL}/verify_by_reference`,
      {
        params: {
          tx_ref: txRef,
        },
        headers: {
          Authorization: `Bearer ${config.flutterwave_public_key}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data, 'checker');
    // Check if the response status is successful
    if (response.data.status === 'success') {
      // Return the data or status from the Flutterwave API response
      return response.data;
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Payment verification failed.'
      );
    }
    // const response = await axios.get(`${FLUTTERWAVE_API_URL}`, {
    //   // params: {
    //   //   tx_ref: txRef,
    //   // },
    //   headers: {
    //     Authorization: `Bearer ${config.flutterwave_public_key}`,
    //     'Content-Type': 'application/json',
    //   },
    //   params: {
    //     page,
    //     from,
    //     to,
    //   },
    // });
    // console.log(response.data.data);
    // // Check if the response status is successful
    // if (response.data.status === 'success') {
    //   // Return the data or status from the Flutterwave API response
    //   return response.data;
    // } else {
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     'Payment verification failed.'
    //   );
    // }
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

export default flutterwavePaymentChecker;
