import { EReviewStatus } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.array(
    z.object({
      sellerId: z.string({ required_error: 'Seller id is required!' }),
      accountId: z.string({ required_error: 'accountId   is required!' }),
      reviewText: z.string({ required_error: 'reviewText is required!' }),
      isAnonymous: z.boolean({ required_error: 'isAnonymous is required!' }),
      reviewStatus: z.enum([...Object.values(EReviewStatus)] as [
        string,
        ...string[]
      ]),
    })
  ),
});

const createReplyValidation = z.object({
  body: z.object({
    reviewId: z.string({ required_error: 'Review id is required!' }),
    reply: z.string({ required_error: 'reviewText is required!' }),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const ReviewValidation = {
  createValidation,
  createReplyValidation,
  updateValidation,
};
