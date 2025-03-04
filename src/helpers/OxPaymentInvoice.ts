import axios from 'axios';
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../errors/ApiError';
import { EPaymentType } from '../interfaces/common';

interface CreatePaymentParams {
  amountUsd: number; // USD equivalent amount (optional if amount is passed)
  email: string; // Required: Client's email
  clientId: string; // Required: Unique identifier of the user
  billingId: string; // Optional: Unique payment identifier
  redirectUrl: string; // Optional: Return payment form as a RedirectURL
  autoReturn?: boolean; // Optional: Auto-redirect to SuccessUrl after transaction
  paymentType: EPaymentType;
  currency: string;
}

const OxPaymentInvoice = async (
  params: CreatePaymentParams
): Promise<string> => {
  const endpoint = 'https://app.0xprocessing.com/Payment';
  const test = true;
  const payload = {
    AmountUSD: params.amountUsd.toString(),
    Currency: params.currency,
    Email: params.email,
    ClientId: params.clientId,
    MerchantId: config.oxAPIKey,
    BillingID: `${params.paymentType}_$_${params.billingId}`,
    Test: test.toString(),
    ReturnUrl: true.toString(),
    CancelUrl: params.redirectUrl.toString(),
    SuccessUrl: params.redirectUrl.toString(),
    AutoReturn: true.toString(),
  };
  console.log(payload);
  try {
    const response = await axios.post(endpoint, new URLSearchParams(payload), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Assume the API response contains a `paymentUrl` for the generated form
    console.log(response.data);
    if (response.data && response.data.redirectUrl) {
      return response.data.redirectUrl;
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to generate payment form URL.'
      );
    }
  } catch (error: any) {
    console.error(
      'Error creating payment form:',
      error.response?.data || error.message
    );
    throw new Error('Unable to create payment form.');
  }
};

export default OxPaymentInvoice;
