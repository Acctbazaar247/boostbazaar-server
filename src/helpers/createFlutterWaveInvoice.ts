import axios from 'axios'; // Make sure to import axios for making HTTP requests
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../errors/ApiError';
import { EPaymentType } from '../interfaces/common';

type PaymentData = {
  tx_ref: string;
  amount: number;
  redirect_url: string;
  customer_email: string;
  paymentType: EPaymentType;
};

export default async function generateFlutterWavePaymentURL(
  paymentData: PaymentData
): Promise<string> {
  const { tx_ref, amount, redirect_url, customer_email, paymentType } =
    paymentData;

  const paymentOptions = 'card'; // You can customize this based on your requirements

  const requestData = {
    tx_ref: `${paymentType}_$_${tx_ref}`,
    amount: amount * config.dollarRate,
    currency: 'NGN',
    redirect_url,
    payment_options: paymentOptions,
    customer: {
      email: customer_email,
    },
  };
  console.log(`Bearer ${config.flutterwave_public_key}`);
  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      requestData,
      {
        headers: {
          Authorization: `Bearer ${config.flutterwave_public_key}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const paymentURL = response.data.data.link;
    return paymentURL;
  } catch (error) {
    console.log(error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to generate payment url'
    );
  }
}

// Example usage
// const paymentData: PaymentData = {
//   tx_ref: 'TXN_123456789',
//   amount: 1000,
//   currency: 'NGN',
//   redirect_url: 'https://your-website.com/callback',
//   customer_email: 'customer@example.com',
//   flutterwave_public_key: 'YOUR_FLUTTERWAVE_PUBLIC_KEY',
// };
