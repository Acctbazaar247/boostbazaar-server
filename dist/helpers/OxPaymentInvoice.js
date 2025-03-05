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
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const OxPaymentInvoice = (params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const endpoint = 'https://app.0xprocessing.com/Payment';
    const test = false;
    const payload = {
        AmountUSD: params.amountUsd.toString(),
        Currency: params.currency,
        Email: params.email,
        ClientId: params.clientId,
        MerchantId: config_1.default.oxAPIKey,
        BillingID: `${params.paymentType}__${params.billingId}`,
        Test: test.toString(),
        ReturnUrl: true.toString(),
        CancelUrl: params.redirectUrl.toString(),
        SuccessUrl: params.redirectUrl.toString(),
        AutoReturn: true.toString(),
    };
    console.log(payload);
    try {
        const response = yield axios_1.default.post(endpoint, new URLSearchParams(payload), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        // Assume the API response contains a `paymentUrl` for the generated form
        console.log(response.data);
        if (response.data && response.data.redirectUrl) {
            return response.data.redirectUrl;
        }
        else {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to generate payment form URL.');
        }
    }
    catch (error) {
        console.error('Error creating payment form:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error('Unable to create payment form.');
    }
});
exports.default = OxPaymentInvoice;
