import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    accountNumber: z.string().min(1),
    accountName: z.string().min(1),
    bankName: z.string().min(1),
    isActive: z.boolean().optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    accountNumber: z.string().min(1).optional(),
    accountName: z.string().min(1).optional(),
    bankName: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
  }),
});
export const BankValidation = {
  createValidation,
  updateValidation,
};
