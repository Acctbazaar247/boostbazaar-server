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
exports.smsPoolRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const config_1 = __importDefault(require("../config"));
const makeOrderRequest = ({ serviceId, countryId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = new form_data_1.default();
    data.append('key', config_1.default.smsPoolApiKey);
    data.append('country', countryId);
    data.append('service', serviceId);
    //   data.append('pool', '');
    //   data.append('max_price', '');
    //   data.append('pricing_option', '');
    data.append('quantity', '1');
    //   data.append('areacode', '');
    //   data.append('exclude', '');
    //   data.append('create_token', '');
    const axiosConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.smspool.net/purchase/sms',
        headers: Object.assign({}, data.getHeaders()),
        data: data,
    };
    const response = yield (0, axios_1.default)(axiosConfig);
    return response.data;
});
const getOrderStatus = (orderId) => __awaiter(void 0, void 0, void 0, function* () { });
// fetch all service
const allService = () => __awaiter(void 0, void 0, void 0, function* () {
    // fetch to
    const data = new form_data_1.default();
    const config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: 'https://api.smspool.net/service/retrieve_all',
        headers: Object.assign({}, data.getHeaders()),
        data: data,
    };
    const response = yield (0, axios_1.default)(config);
    return response.data;
});
const getAllOrderHistory = ({ orderId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = new form_data_1.default();
    data.append('key', config_1.default.smsPoolApiKey);
    if (orderId) {
        data.append('search', orderId);
    }
    const smsPoolHistoryConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.smspool.net/request/history',
        headers: Object.assign({}, data.getHeaders()),
        data: data,
    };
    const response = yield (0, axios_1.default)(smsPoolHistoryConfig);
    return response.data;
});
const refundOrder = ({ orderId }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = new form_data_1.default();
    data.append('key', config_1.default.smsPoolApiKey);
    data.append('orderid', orderId);
    const smsPoolCancelConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.smspool.net/sms/cancel',
        headers: Object.assign({}, data.getHeaders()),
        data: data,
    };
    const response = yield (0, axios_1.default)(smsPoolCancelConfig);
    return response.data;
});
const getBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = new form_data_1.default();
    data.append('key', config_1.default.smsPoolApiKey);
    const smsPoolBalanceConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.smspool.net/request/balance',
        headers: Object.assign({}, data.getHeaders()),
        data: data,
    };
    const response = yield (0, axios_1.default)(smsPoolBalanceConfig);
    return response.data;
});
exports.smsPoolRequest = {
    makeOrderRequest,
    getOrderStatus,
    allService,
    getAllOrderHistory,
    refundOrder,
    getBalance,
};
