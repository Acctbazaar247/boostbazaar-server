"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
const invitation = zod_1.z.object({
    body: zod_1.z.object({
        sendTo: zod_1.z.string({ required_error: 'sendTo is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.ReferralValidation = {
    createValidation,
    updateValidation,
    invitation,
};
