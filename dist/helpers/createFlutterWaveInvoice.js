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
const axios_1 = __importDefault(require("axios")); // Make sure to import axios for making HTTP requests
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
function generateFlutterWavePaymentURL(paymentData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tx_ref, amount, redirect_url, customer_email, paymentType } = paymentData;
        const paymentOptions = 'card'; // You can customize this based on your requirements
        const requestData = {
            tx_ref: `${paymentType}_$_${tx_ref}`,
            amount: amount * config_1.default.dollarRate,
            currency: 'NGN',
            redirect_url,
            payment_options: paymentOptions,
            customer: {
                email: customer_email,
            },
        };
        console.log(`Bearer ${config_1.default.flutterwave_public_key}`);
        try {
            const response = yield axios_1.default.post('https://api.flutterwave.com/v3/payments', requestData, {
                headers: {
                    Authorization: `Bearer ${config_1.default.flutterwave_public_key}`,
                    'Content-Type': 'application/json',
                },
            });
            const paymentURL = response.data.data.link;
            return paymentURL;
        }
        catch (error) {
            console.log(error);
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to generate payment url');
        }
    });
}
exports.default = generateFlutterWavePaymentURL;
// Example usage
// const paymentData: PaymentData = {
//   tx_ref: 'TXN_123456789',
//   amount: 1000,
//   currency: 'NGN',
//   redirect_url: 'https://your-website.com/callback',
//   customer_email: 'customer@example.com',
//   flutterwave_public_key: 'YOUR_FLUTTERWAVE_PUBLIC_KEY',
// };
