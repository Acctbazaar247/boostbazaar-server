import { EApprovedForSale, accountCategory } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    name: z.string(),
    username: z.string(),
    password: z.string(),
    description: z.string(),
    messageFromAdmin: z.string().optional(),
    preview: z.string().optional(),
    price: z.number(),
    category: z.nativeEnum(accountCategory),
    approvedForSale: z
      .nativeEnum(EApprovedForSale)
      .default(EApprovedForSale.pending),
    isSold: z.boolean().default(false),
  }),
});
const createValidationMulti = z.object({
  body: z
    .array(
      z.object({
        name: z.string(),
        username: z.string(),
        password: z.string(),
        description: z.string(),
        preview: z.string().optional(),
        price: z.number(),
        category: z.nativeEnum(accountCategory),
        approvedForSale: z
          .nativeEnum(EApprovedForSale)
          .default(EApprovedForSale.pending),
        isSold: z.boolean().default(false),
      })
    )
    .min(1),
});
const updateValidation = z.object({
  body: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    category: z.nativeEnum(accountCategory).optional(),
    approvedForSale: z.nativeEnum(EApprovedForSale).optional(),
    isSold: z.boolean().optional(),
    ownById: z.string().optional(),
    preview: z.string().nullable().optional(),
    messageFromAdmin: z.string().optional().nullable(),
  }),
});
export const AccountValidation = {
  createValidation,
  updateValidation,
  createValidationMulti,
};
