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
exports.SmsPoolService = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const smsPoolRequest_1 = require("../../../helpers/smsPoolRequest");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllSmsPool = () => __awaiter(void 0, void 0, void 0, function* () {
    return smsPoolRequest_1.smsPoolRequest.allService();
});
// const countrySuccess = async (): Promise<TSmsPoolService | null> => {
//   const newSmsPool = await prisma.smsPool.create({
//     data: payload,
//   });
//   return newSmsPool;
// };
// create sms pool order
const getSingleSmsPoolServiceCountry = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = new form_data_1.default();
    data.append('service', id);
    const config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: 'https://api.smspool.net/request/success_rate',
        headers: Object.assign({}, data.getHeaders()),
        data: data,
    };
    const response = yield (0, axios_1.default)(config);
    return response.data;
});
const createSmsPoolOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const services = yield getSingleSmsPoolServiceCountry(payload.serviceId);
    if (!services.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Service not found');
    }
    const serviceIndex = services.findIndex(service => service.short_name === payload.countryId);
    if (serviceIndex === -1) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Country not found');
    }
    const service = services[serviceIndex];
    const maxPrice = service.price;
    const orderById = payload.orderById;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: orderById,
        },
        include: {
            Currency: true,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    if (!user.Currency) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not have currency');
    }
    const userCurrency = user.Currency;
    const serviceCharge = parseFloat(maxPrice) * (config_1.default.smsPoolServiceChargeInPercentage / 100);
    const totalAmount = parseFloat(maxPrice) + serviceCharge;
    if (totalAmount > userCurrency.amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Insufficient balance');
    }
    // if user have enough balance then create sms pool order
    const newSmsPoolOrder = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // make order in sms pool api
        const orderResponse = yield smsPoolRequest_1.smsPoolRequest.makeOrderRequest({
            serviceId: payload.serviceId,
            countryId: payload.countryId,
        });
        console.log(orderResponse);
        const smsConst = parseFloat(orderResponse.cost);
        const orderServiceCharge = smsConst * (config_1.default.smsPoolServiceChargeInPercentage / 100);
        const lastCost = smsConst + orderServiceCharge;
        console.log('cost', smsConst, lastCost);
        const smsPoolOrder = yield tx.smsPoolOrder.create({
            data: Object.assign(Object.assign({}, payload), { cost: lastCost, orderId: orderResponse.order_id }),
        });
        const currency = yield tx.currency.update({
            where: { id: userCurrency.id },
            data: {
                amount: {
                    decrement: lastCost,
                },
            },
        });
        if (currency.amount < 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Insufficient balance');
        }
        return smsPoolOrder;
    }));
    return newSmsPoolOrder;
});
exports.SmsPoolService = {
    getAllSmsPool,
    // createSmsPool,
    createSmsPoolOrder,
    getSingleSmsPoolServiceCountry,
};
