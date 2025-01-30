"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsPoolValidation = void 0;
const zod_1 = require("zod");
const createSmsPoolOrderValidation = zod_1.z.object({
    body: zod_1.z.object({
        serviceId: zod_1.z.string({ required_error: 'service Id is required' }),
        countryId: zod_1.z.string({ required_error: 'country Id is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.SmsPoolValidation = {
    createSmsPoolOrderValidation,
    updateValidation,
};
