import { z } from 'zod';

const createSmsPoolOrderValidation = z.object({
  body: z.object({
    serviceId: z.string({ required_error: 'service Id is required' }),
    countryId: z.string({ required_error: 'country Id is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const SmsPoolValidation = {
  createSmsPoolOrderValidation,
  updateValidation,
};
