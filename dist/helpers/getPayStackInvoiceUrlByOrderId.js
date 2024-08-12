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
const config_1 = __importDefault(require("../config"));
function getInvoiceUrl(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.paystack.co/transaction/verify/${orderId}`;
        const headers = {
            Authorization: `Bearer ${config_1.default.paystackPaymentApiKey}`,
        };
        try {
            const response = yield axios_1.default.get(url, { headers });
            const data = response.data;
            if (data.status) {
                return data.data.metadata.invoice_url;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    });
}
exports.default = getInvoiceUrl;
