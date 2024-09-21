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
const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3/transactions';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flutterwavePaymentChecker(txRef) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log({ txRef });
        try {
            const response = yield axios_1.default.get(`${FLUTTERWAVE_API_URL}/verify_by_reference`, {
                params: {
                    tx_ref: txRef,
                },
                headers: {
                    Authorization: `Bearer ${config_1.default.flutterwave_public_key}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data, 'checker');
            // Check if the response status is successful
            if (response.data.status === 'success') {
                // Return the data or status from the Flutterwave API response
                return response.data;
            }
            else {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Payment verification failed.');
            }
            // const response = await axios.get(`${FLUTTERWAVE_API_URL}`, {
            //   // params: {
            //   //   tx_ref: txRef,
            //   // },
            //   headers: {
            //     Authorization: `Bearer ${config.flutterwave_public_key}`,
            //     'Content-Type': 'application/json',
            //   },
            //   params: {
            //     page,
            //     from,
            //     to,
            //   },
            // });
            // console.log(response.data.data);
            // // Check if the response status is successful
            // if (response.data.status === 'success') {
            //   // Return the data or status from the Flutterwave API response
            //   return response.data;
            // } else {
            //   throw new ApiError(
            //     httpStatus.BAD_REQUEST,
            //     'Payment verification failed.'
            //   );
            // }
        }
        catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    });
}
exports.default = flutterwavePaymentChecker;
