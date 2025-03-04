import { CurrencyRequest } from '@prisma/client';

export type ICurrencyRequestFilters = {
  searchTerm?: string;
};

export type ICurrencyRequestInvoice = {
  amount: number;
  currency: string;
  orderId: string;
};
export type ICreateCurrencyRequestRes = {
  url: string;
} & CurrencyRequest;
export enum KoraPayEvent {
  // eslint-disable-next-line no-unused-vars
  PAYMENT_SUCCESS = 'charge.success',
  // eslint-disable-next-line no-unused-vars
  PAYMENT_FAILED = 'charge.failed',
  // eslint-disable-next-line no-unused-vars
  PAYMENT_PENDING = 'charge.pending',
  // eslint-disable-next-line no-unused-vars
  REFUND_SUCCESS = 'refund.success',
  // eslint-disable-next-line no-unused-vars
  REFUND_FAILED = 'refund.failed',
}
export type CurrencyRequestPayloadForOx = {
  pay_currency_btc: boolean | undefined;
  currency: string;
} & CurrencyRequest;
export type TKoraPayWebhookResponse = {
  event: KoraPayEvent; // The type of event, e.g., "payment.success"
  data: {
    amount: number; // The amount paid
    currency: string; // The currency of the payment
    reference: string; // The transaction reference
    status: string; // Payment status, e.g., "success"
    customer: {
      name: string; // Customer's name
      email: string; // Customer's email
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>; // Additional metadata sent during the checkout request
  };
  timestamp: string; // The timestamp of the event
};

export enum EOxWebhookStatus {
  Success = 'Success',
  Pending = 'Pending',
  Failed = 'Failed',
}

export type TOXWebhookResponse = {
  PaymentId: number;
  MerchantId: string;
  Amount: number;
  TotalAmount: number;
  Currency: string;
  Email: string;
  Status: EOxWebhookStatus; // Assuming these are possible statuses
  Signature: string;
  BillingID: string;
  AmountUSD: number;
  TotalAmountUSD: number;
  Insufficient: boolean;
  Test: boolean;
  ClientId: string;
  TxHashes: string[];
};
