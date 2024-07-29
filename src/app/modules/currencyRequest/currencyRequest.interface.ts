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
