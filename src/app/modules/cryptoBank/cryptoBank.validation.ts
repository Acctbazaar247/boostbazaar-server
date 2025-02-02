import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    walletAddress: z.string({ required_error: 'Wallet address is required' }),
    name: z.string({ required_error: 'Name is required' }),
    isActive: z.boolean().optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    walletAddress: z.string().optional(),
    name: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
export const CryptoBankValidation = {
  createValidation,
  updateValidation,
};
