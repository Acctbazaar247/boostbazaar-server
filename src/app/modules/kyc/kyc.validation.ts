import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    phoneNumber: z.string({ required_error: 'phoneNumber is required' }),
    whatsAppNumber: z.string({ required_error: 'whatsAppNumber is required' }),
    telegramNumber: z.string({ required_error: 'telegramNumber is required' }),

    userName: z.string({ required_error: 'userName is required' }),
    country: z.string({ required_error: 'country is required' }),
    address: z.string({ required_error: 'address is required' }),
    state: z.string({ required_error: 'state is required' }),
    city: z.string({ required_error: 'city is required' }),
    birthDate: z.string({ required_error: 'Birthday is required' }),
    meansOfIdentification: z.enum([
      'PASSPORT',
      `DRIVER_LICENSE`,
      'NATIONAL_ID',
    ]),
    identificationNumber: z.string({
      required_error: 'identificationNumber is required',
    }),
    identificationExpiredDate: z
      .string({
        required_error: 'identificationExpiredDate is required',
      })
      .optional()
      .nullable(),
    identityImage: z.string({ required_error: 'identityImage is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }).optional(),
    userName: z.string({ required_error: 'userName is required' }).optional(),
    country: z.string({ required_error: 'country is required' }).optional(),
    address: z.string({ required_error: 'address is required' }).optional(),
    state: z.string({ required_error: 'state is required' }).optional(),
    city: z.string({ required_error: 'city is required' }).optional(),
    birthDate: z.string({ required_error: 'Birthday is required' }).optional(),
    messageByAdmin: z
      .string({ required_error: 'messageByAdmin is required' })
      .optional(),
    meansOfIdentification: z
      .string({
        required_error: 'meansOfIdentification is required',
      })
      .optional(),
    identificationNumber: z
      .string({
        required_error: 'identificationNumber is required',
      })
      .optional(),
    identificationExpiredDate: z
      .string({
        required_error: 'identificationExpiredDate is required',
      })
      .optional()
      .nullable(),
    identityImage: z
      .string({ required_error: 'identityImage is required' })
      .optional(),
  }),
});
export const KycValidation = {
  createValidation,
  updateValidation,
};
