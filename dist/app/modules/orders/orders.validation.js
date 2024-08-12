"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        accountId: zod_1.z.string({ required_error: 'accountId is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.OrdersValidation = {
    createValidation,
    updateValidation,
};
