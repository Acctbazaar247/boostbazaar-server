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
exports.SmsPoolOrderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const smsPoolOrder_constant_1 = require("./smsPoolOrder.constant");
const smsPoolOrder_service_1 = require("./smsPoolOrder.service");
const createSmsPoolOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SmsPoolOrderData = req.body;
    const result = yield smsPoolOrder_service_1.SmsPoolOrderService.createSmsPoolOrder(SmsPoolOrderData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SmsPoolOrder Created successfully!',
        data: result,
    });
}));
const getAllSmsPoolOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...smsPoolOrder_constant_1.smsPoolOrderFilterAbleFields,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield smsPoolOrder_service_1.SmsPoolOrderService.getAllSmsPoolOrder(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SmsPoolOrder retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleSmsPoolOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = req.user;
    const result = yield smsPoolOrder_service_1.SmsPoolOrderService.getSingleSmsPoolOrder(id, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SmsPoolOrder retrieved  successfully!',
        data: result,
    });
}));
const updateSmsPoolOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user;
    const result = yield smsPoolOrder_service_1.SmsPoolOrderService.updateSmsPoolOrder(id, updateAbleData, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SmsPoolOrder Updated successfully!',
        data: result,
    });
}));
const updateSmsPoolOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user;
    const result = yield smsPoolOrder_service_1.SmsPoolOrderService.updateSmsPoolOrderStatus(id, updateAbleData, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SmsPoolOrder Updated successfully!',
        data: result,
    });
}));
const deleteSmsPoolOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield smsPoolOrder_service_1.SmsPoolOrderService.deleteSmsPoolOrder(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SmsPoolOrder deleted successfully!',
        data: result,
    });
}));
exports.SmsPoolOrderController = {
    getAllSmsPoolOrder,
    createSmsPoolOrder,
    updateSmsPoolOrder,
    getSingleSmsPoolOrder,
    deleteSmsPoolOrder,
    updateSmsPoolOrderStatus,
};
