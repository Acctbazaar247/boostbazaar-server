import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }),
    review: z.string({ required_error: 'review is required' }),
    star: z.number({ required_error: 'star is required' }).min(0).max(5),
  }),
});
const updateValidation = z.object({
  body: z.object({}),
});
export const ReviewValidation = {
  createValidation,
  updateValidation,
};
