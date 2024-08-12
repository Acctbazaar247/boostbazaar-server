"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'title is required' }),
        review: zod_1.z.string({ required_error: 'review is required' }),
        star: zod_1.z.number({ required_error: 'star is required' }).min(0).max(5),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.ReviewValidation = {
    createValidation,
    updateValidation,
};
