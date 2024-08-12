"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const PAYSTACK_SECRET_KEY = config_1.default.paystackPaymentApiKey;
// Function to initiate a payment
const initiatePayment = (amount, email, reference, paymentType, orderId, callbackUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('https://api.paystack.co/transaction/initialize', 
        // Paystack uses values in kobo (1 NGN = 100 kobo)
        {
            amount: amount * 100 * config_1.default.dollarRate,
            email,
            reference,
            callback_url: callbackUrl,
            metadata: {
                orderId,
                payment_type: paymentType,
            },
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (err) {
        // console.log(err?.response);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something wrong happen');
    }
});
exports.initiatePayment = initiatePayment;
// Function to verify a payment
const verifyPayment = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
});
exports.verifyPayment = verifyPayment;
