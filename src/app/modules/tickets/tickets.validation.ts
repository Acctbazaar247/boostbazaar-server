import { ETickets } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    message: z.string({ required_error: 'Message is required' }),
    subject: z.string({ required_error: 'subject is required' }),
    status: z
      .enum([...Object.keys(ETickets)] as [string, ...string[]])
      .default(ETickets.open),
  }),
});
const updateValidation = z.object({
  body: z.object({
    message: z.string({ required_error: 'Message is required' }).optional(),
    subject: z.string({ required_error: 'subject is required' }).optional(),
    status: z
      .enum([...Object.keys(ETickets)] as [string, ...string[]])
      .default(ETickets.open)
      .optional(),
  }),
});
export const TicketsValidation = {
  createValidation,
  updateValidation,
};
