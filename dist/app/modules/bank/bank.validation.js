"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        accountNumber: zod_1.z.string().min(1),
        accountName: zod_1.z.string().min(1),
        bankName: zod_1.z.string().min(1),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        accountNumber: zod_1.z.string().min(1).optional(),
        accountName: zod_1.z.string().min(1).optional(),
        bankName: zod_1.z.string().min(1).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.BankValidation = {
    createValidation,
    updateValidation,
};
