import { EPlanType } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    planType: z.enum([...Object.values(EPlanType)] as [string, ...string[]]),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const PlanValidation = {
  createValidation,
  updateValidation,
};
