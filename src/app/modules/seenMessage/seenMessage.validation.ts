import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    orderId: z.string({ required_error: 'groupId is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    orderId: z.string({ required_error: 'orderId is required' }),
  }),
});
export const SeenMessageValidation = {
  createValidation,
  updateValidation,
};
