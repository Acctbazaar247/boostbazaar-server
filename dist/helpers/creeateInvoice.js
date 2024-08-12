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
const createNowPayInvoice = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    const nowPaymentsApiKey = config_1.default.nowPaymentApiKey || ''; // Use your sandbox API key
    // Use the sandbox API URL
    const sandboxApiUrl = config_1.default.nowPaymentInvoiceUrl || '';
    try {
        const response = yield axios_1.default.post(sandboxApiUrl, Object.assign(Object.assign({}, invoice), { price_amount: invoice.price_amount, ipn_callback_url: invoice.ipn_callback_url
                ? config_1.default.baseServerUrl + invoice.ipn_callback_url
                : undefined, price_currency: 'USD' }), {
            headers: {
                'x-api-key': nowPaymentsApiKey,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong');
    }
});
exports.default = createNowPayInvoice;
