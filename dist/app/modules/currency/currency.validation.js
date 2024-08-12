"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().default(0),
        ownById: zod_1.z.string({ required_error: 'ownById is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number({ required_error: 'amount must be required' }),
    }),
});
exports.CurrencyValidation = {
    createValidation,
    updateValidation,
};
