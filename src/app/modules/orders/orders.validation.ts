import { EAccountCategory } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    accountCategory: z.enum([...Object.keys(EAccountCategory)] as [
      string,
      ...string[]
    ]),
    quantity: z.number({ required_error: 'quantity is required' }),
    japServiceId: z.string({ required_error: 'japServiceId is required' }),
    link: z.string({ required_error: 'Link is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const OrdersValidation = {
  createValidation,
  updateValidation,
};
