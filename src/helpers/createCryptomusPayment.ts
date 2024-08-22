import axios from 'axios';
import config from '../config';

type CreatePaymentResponse = {
  status: string;
  uuid: string;
  payment_status: string;
  payment_url: string;
  // Add other fields as needed
};

type CreatePaymentParams = {
  amount: number;
  order_id: string;
  callback_url: string;
  success_url: string;
  fail_url?: string;
  // Add other parameters as needed
};

export async function createCryptomusPayment(
  params: CreatePaymentParams
): Promise<string> {
  const apiKey = config.cryptomus_key;
  const apiUrl = 'https://api.cryptomus.com/v1/payment';

  try {
    const response = await axios.post<CreatePaymentResponse>(
      apiUrl,
      {
        amount: params.amount,
        currency: 'BTC',
        order_id: params.order_id,
        callback_url: params.callback_url,
        success_url: params.success_url,
        fail_url: params.fail_url,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (response.data.status === 'success') {
      return response.data.payment_url;
    } else {
      throw new Error(`Failed to create payment: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Error creating Cryptomus payment:', error);
    throw new Error('Could not create payment');
  }
}
