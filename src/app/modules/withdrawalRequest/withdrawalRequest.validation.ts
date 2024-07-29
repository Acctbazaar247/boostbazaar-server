import { EStatusOfWithdrawalRequest } from '@prisma/client';
import { z } from 'zod';
import config from '../../../config';

const createValidation = z.object({
  body: z.object({
    amount: z
      .number()
      .min(config.withdrawalMinMoney)
      .max(config.withdrawalMaxMoney),
    fullName: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    walletAddress: z.string().optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    status: z.enum([...Object.values(EStatusOfWithdrawalRequest)] as [
      string,
      ...string[]
    ]),
    message: z.string().optional(),
  }),
});
export const WithdrawalRequestValidation = {
  createValidation,
  updateValidation,
};
