import { EStatusOfCurrencyRequest } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    amount: z.number({ required_error: 'amount is required' }).min(0),
    message: z.string({ required_error: 'message is required' }).optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    amount: z
      .number({ required_error: 'amount is required' })
      .min(0)
      .optional(),
    message: z.string({ required_error: 'message is required' }).optional(),
    status: z.nativeEnum(EStatusOfCurrencyRequest).optional(),
  }),
});
export const CurrencyRequestValidation = {
  createValidation,
  updateValidation,
};
