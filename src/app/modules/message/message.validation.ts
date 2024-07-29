import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    orderId: z.string({ required_error: 'orderId is required' }),
    text: z
      .string({ required_error: 'text is required' })
      .optional()
      .nullable(),
    image: z
      .string({ required_error: 'image is required' })
      .optional()
      .nullable(),
    sendBy: z
      .object({
        email: z.string(),
        id: z.string(),
        name: z.string(),
        profileImg: z.string(),
      })
      .optional()
      .nullable(),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const MessageValidation = {
  createValidation,
  updateValidation,
};
