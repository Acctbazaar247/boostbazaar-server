import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    accountId: z.string({ required_error: 'accountId is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const OrdersValidation = {
  createValidation,
  updateValidation,
};
