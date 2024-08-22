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
exports.createCryptomusPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
function createCryptomusPayment(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = config_1.default.cryptomus_key;
        const apiUrl = 'https://api.cryptomus.com/v1/payment';
        try {
            const response = yield axios_1.default.post(apiUrl, {
                amount: params.amount,
                currency: 'BTC',
                order_id: params.order_id,
                callback_url: params.callback_url,
                success_url: params.success_url,
                fail_url: params.fail_url,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            });
            if (response.data.status === 'success') {
                return response.data.payment_url;
            }
            else {
                throw new Error(`Failed to create payment: ${response.data.status}`);
            }
        }
        catch (error) {
            console.error('Error creating Cryptomus payment:', error);
            throw new Error('Could not create payment');
        }
    });
}
exports.createCryptomusPayment = createCryptomusPayment;
