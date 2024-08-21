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
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
function createOrder(serviceId, link, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.post(config_1.default.japUrl, {
            key: config_1.default.japApiKey,
            action: 'add',
            service: serviceId,
            link: link,
            quantity: quantity,
        });
        if (response.data.error) {
            console.log('Error:', response.data.error);
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, response.data.error);
        }
        else {
            console.log('Order ID:', response.data.order);
            return response.data.order;
        }
    });
}
exports.default = createOrder;
