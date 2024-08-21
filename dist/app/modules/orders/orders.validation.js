"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        accountCategory: zod_1.z.enum([...Object.keys(client_1.EAccountCategory)]),
        quantity: zod_1.z.number({ required_error: 'quantity is required' }),
        japServiceId: zod_1.z.string({ required_error: 'japServiceId is required' }),
        link: zod_1.z.string({ required_error: 'Link is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.OrdersValidation = {
    createValidation,
    updateValidation,
};
