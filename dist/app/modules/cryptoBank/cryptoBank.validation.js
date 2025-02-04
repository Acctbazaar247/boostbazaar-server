"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoBankValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        walletAddress: zod_1.z.string({ required_error: 'Wallet address is required' }),
        name: zod_1.z.string({ required_error: 'Name is required' }),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        walletAddress: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.CryptoBankValidation = {
    createValidation,
    updateValidation,
};
