"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRequestValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number({ required_error: 'amount is required' }).min(0),
        message: zod_1.z.string({ required_error: 'message is required' }).optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z
            .number({ required_error: 'amount is required' })
            .min(0)
            .optional(),
        message: zod_1.z.string({ required_error: 'message is required' }).optional(),
        status: zod_1.z.nativeEnum(client_1.EStatusOfCurrencyRequest).optional(),
    }),
});
exports.CurrencyRequestValidation = {
    createValidation,
    updateValidation,
};
