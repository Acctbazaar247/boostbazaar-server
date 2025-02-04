"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualCurrencyRequestValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// account name and bankName is required when account number is provided
// wallet address is required when account number is not provided
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        requestedAmount: zod_1.z.number().min(1),
        receivedAmount: zod_1.z.number().optional(),
        accountName: zod_1.z.string().optional(),
        accountNumber: zod_1.z.string().optional(),
        bankName: zod_1.z.string().optional(),
        transactionHash: zod_1.z.string().optional(),
        dollarRate: zod_1.z.number().optional(),
        bankId: zod_1.z.string().optional(),
        cryptoBankId: zod_1.z.string().optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([...Object.values(client_1.EStatusOfManualCurrencyRequest)]),
        receivedAmount: zod_1.z.number().optional(),
        message: zod_1.z.string().optional(),
    }),
});
exports.ManualCurrencyRequestValidation = {
    createValidation,
    updateValidation,
};
