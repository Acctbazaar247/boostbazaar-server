import { z } from 'zod';

const createValidation = z.object({
  body: z.object({}),
});
const invitation = z.object({
  body: z.object({
    sendTo: z.string({ required_error: 'sendTo is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const ReferralValidation = {
  createValidation,
  updateValidation,
  invitation,
};
