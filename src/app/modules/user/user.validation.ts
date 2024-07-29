import { UserRole } from '@prisma/client';
import { z } from 'zod';
const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }), // Minimum 2 characters for the name
    email: z.string({ required_error: 'email is required' }).email(), // Valid email format
    contactNo: z.string({ required_error: 'contactNo is required' }), // 10-digit phone number
    address: z.string({ required_error: 'address is required' }),
    profileImg: z.string({ required_error: 'profileImg is required' }),
    password: z.string({ required_error: 'password is required' }),
    role: z
      .enum([...Object.values(UserRole)] as [string, ...string[]], {})
      .optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }).optional(),
    email: z.string({ required_error: 'email is required' }).optional(),
    contactNo: z.string({ required_error: 'contactNo is required' }).optional(),
    address: z
      .string({ required_error: 'address is required' })
      .optional()
      .nullable(),
    state: z
      .string({ required_error: 'state is required' })
      .optional()
      .nullable(),
    city: z
      .string({ required_error: 'city is required' })
      .optional()
      .nullable(),
    profileImg: z
      .string({ required_error: 'profileImg is required' })
      .optional(),
    password: z.string({ required_error: 'password is required' }).optional(),
    role: z
      .enum([...Object.values(UserRole)] as [string, ...string[]], {})
      .optional(),
  }),
});

const sendQueryValidation = z.object({
  body: z.object({
    description: z.string({ required_error: 'description is required' }),
    queryType: z.string({ required_error: 'queryType is required' }),
  }),
});
export const UserValidation = {
  createValidation,
  updateValidation,
  sendQueryValidation,
};
