import axios from 'axios';
import httpStatus from 'http-status';
import config from '../config';
import ApiError from '../errors/ApiError';

// Define the environment variables for security
const KORA_API_BASE_URL = 'https://api.korapay.com/merchant/api/v1';
const KORA_API_SECRET_KEY = config.koraApiSecretKey;

type CheckoutRequest = {
  amount: number; // The amount to charge
  currency: string; // Currency code, e.g., "NGN", "USD"
  customerName: string; // Customer's name
  customerEmail: string; // Customer's email
  reference: string; // Unique transaction reference
  description?: string; // Description of the transaction
  callbackUrl: string; // Callback URL for payment status updates
};

type CheckoutResponse = {
  checkoutUrl: string; // URL to redirect the user to
};

export const createKoraPayCheckout = async (
  request: CheckoutRequest
): Promise<CheckoutResponse> => {
  try {
    // Endpoint for Kora Pay checkout
    const endpoint = `${KORA_API_BASE_URL}/charges/initialize`; // Update to the actual endpoint

    // Set up headers
    const headers = {
      Authorization: `Bearer ${KORA_API_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };

    // Make the API request
    const response = await axios.post(
      endpoint,
      {
        amount:
          request.currency === 'USD'
            ? request.amount
            : request.amount * config.dollarRate,
        currency: request.currency,
        customer: {
          name: request.customerName,
          email: request.customerEmail,
        },
        reference: request.reference,
        //
        notification_url: `${config.baseServerUrl}/currency-request/kora-pay-webhook`,
        redirect_url: request.callbackUrl,
        merchant_bears_cost: false,
      },
      { headers }
    );
    //
    // Extract the checkout URL from the response
    console.log(response.data, 'response from kora pay');
    if (response.data && response.data.data?.checkout_url) {
      return { checkoutUrl: response.data.data?.checkout_url };
    } else {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Invalid response format from Kora Pay API'
      );
    }
  } catch (error) {
    // Handle errors
    console.log(error, 'error from kora pay');
    // console the error response
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to create Kora Pay checkout request'
    );
  }
};

// Example usage
