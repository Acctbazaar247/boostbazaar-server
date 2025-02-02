import { EStatusOfManualCurrencyRequest } from '@prisma/client';
import { z } from 'zod';

// account name and bankName is required when account number is provided
// wallet address is required when account number is not provided
const createValidation = z.object({
  body: z.object({
    requestedAmount: z.number().min(1),
    receivedAmount: z.number().optional(),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    transactionHash: z.string().optional(),
    dollarRate: z.number().optional(),
    bankId: z.string().optional(),
    cryptoBankId: z.string().optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    status: z.enum([...Object.values(EStatusOfManualCurrencyRequest)] as [
      string,
      ...string[]
    ]),
    receivedAmount: z.number().optional(),
    message: z.string().optional(),
  }),
});
export const ManualCurrencyRequestValidation = {
  createValidation,
  updateValidation,
};
