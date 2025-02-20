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
exports.createKoraPayCheckout = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
// Define the environment variables for security
const KORA_API_BASE_URL = 'https://api.korapay.com/merchant/api/v1';
// const KORA_API_BASE_URL = 'https://sandbox.korapay.com/merchant/api/v1';
const KORA_API_SECRET_KEY = config_1.default.koraApiSecretKey;
const createKoraPayCheckout = (request) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log({ KORA_API_SECRET_KEY });
    try {
        // Endpoint for Kora Pay checkout
        const endpoint = `${KORA_API_BASE_URL}/charges/initialize`; // Update to the actual endpoint
        // Set up headers
        const headers = {
            Authorization: `Bearer ${KORA_API_SECRET_KEY}`,
            'Content-Type': 'application/json',
        };
        // Make the API request
        const response = yield axios_1.default.post(endpoint, {
            amount: request.currency === 'USD'
                ? request.amount
                : request.amount * config_1.default.dollarRate,
            currency: request.currency,
            customer: {
                name: request.customerName,
                email: request.customerEmail,
            },
            reference: request.reference,
            //
            notification_url: `${config_1.default.baseServerUrl}/currency-request/webhook/korapay`,
            redirect_url: request.callbackUrl,
            merchant_bears_cost: false,
        }, { headers });
        //
        // Extract the checkout URL from the response
        console.log(response.data, 'response from kora pay');
        if (response.data && ((_a = response.data.data) === null || _a === void 0 ? void 0 : _a.checkout_url)) {
            return { checkoutUrl: (_b = response.data.data) === null || _b === void 0 ? void 0 : _b.checkout_url };
        }
        else {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid response format from Kora Pay API');
        }
    }
    catch (error) {
        // Handle errors
        console.log(error, 'error from kora pay');
        // console the error response
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Kora Pay checkout request');
    }
});
exports.createKoraPayCheckout = createKoraPayCheckout;
// Example usage
