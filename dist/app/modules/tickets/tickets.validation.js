"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string({ required_error: 'Message is required' }),
        subject: zod_1.z.string({ required_error: 'subject is required' }),
        status: zod_1.z
            .enum([...Object.keys(client_1.ETickets)])
            .default(client_1.ETickets.open),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string({ required_error: 'Message is required' }).optional(),
        subject: zod_1.z.string({ required_error: 'subject is required' }).optional(),
        status: zod_1.z
            .enum([...Object.keys(client_1.ETickets)])
            .default(client_1.ETickets.open)
            .optional(),
    }),
});
exports.TicketsValidation = {
    createValidation,
    updateValidation,
};
