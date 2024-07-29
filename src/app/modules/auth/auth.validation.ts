import { EPayWith, UserRole } from '@prisma/client';
import { z } from 'zod';

const createAuthZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }).min(8),
    name: z.string({ required_error: 'Name is required' }),
    role: z.nativeEnum(UserRole).default(UserRole.user).optional(),
    paymentWithPaystack: z.boolean().default(false).optional(),
    txId: z.string({ required_error: 'txId is required' }).optional(),
    referralId: z
      .string({ required_error: 'referralId is required' })
      .optional(),
  }),
});
const loginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});
const verifyToken = z.object({
  body: z.object({
    token: z.number({ required_error: 'Token is required' }),
  }),
});
const verifyForgotToken = z.object({
  body: z.object({
    token: z.number({ required_error: 'Token is required' }),
    email: z.string({ required_error: 'Email is required' }),
  }),
});
const changePassword = z.object({
  body: z.object({
    token: z.number({ required_error: 'Token is required' }).optional(),
    email: z.string({ required_error: 'Email is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' }),
    prePassword: z
      .string({ required_error: 'Pre Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .optional(),
  }),
});
const changeWithdrawPin = z.object({
  body: z.object({
    otp: z.number({ required_error: 'Token is required' }).optional(),
    newPassword: z
      .string({ required_error: 'Password is required' })
      .min(4, { message: 'Password must be  4 characters long' })
      .max(4, { message: 'Password must be 4 characters long' }),
    prePassword: z
      .string({ required_error: 'Password is required' })
      .min(4, { message: 'Password must be  4 characters long' })
      .max(4, { message: 'Password must be 4 characters long' })
      .optional(),
  }),
});
const addWithdrawalPasswordFirstTime = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(4, { message: 'Password must be  4 characters long' })
      .max(4, { message: 'Password must be  4 characters long' }),
  }),
});
const becomeSeller = z.object({
  body: z.object({
    payWith: z.enum(Object.keys(EPayWith) as [string, ...string[]]),
  }),
});
export const AuthValidation = {
  createAuthZodSchema,
  refreshTokenZodSchema,
  loginZodSchema,
  verifyToken,
  changePassword,
  verifyForgotToken,
  addWithdrawalPasswordFirstTime,
  becomeSeller,
  changeWithdrawPin,
};
