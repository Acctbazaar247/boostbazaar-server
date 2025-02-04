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
exports.ManualCurrencyRequestController = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const manualCurrencyRequest_constant_1 = require("./manualCurrencyRequest.constant");
const manualCurrencyRequest_service_1 = require("./manualCurrencyRequest.service");
const createManualCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ManualCurrencyRequestData = req.body;
    // check is the provide both accountNumber and walletAddress
    if (ManualCurrencyRequestData.accountNumber &&
        ManualCurrencyRequestData.walletAddress) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You cannot provide both account number and wallet address');
    }
    // add validation if accountNumber exits  then
    if (ManualCurrencyRequestData.accountNumber) {
        const requiredFields = ['bankId', 'bankName', 'accountName'];
        requiredFields.forEach(field => {
            if (!ManualCurrencyRequestData[field]) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `${field} is required when account number is provided`);
            }
        });
    }
    else if (ManualCurrencyRequestData.transactionHash) {
        const requiredFields = ['cryptoBankId'];
        requiredFields.forEach(field => {
            if (!ManualCurrencyRequestData[field]) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `${field} is required when using wallet`);
            }
        });
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalidate Data for Manual Currency Request');
    }
    const user = req.user;
    const result = yield manualCurrencyRequest_service_1.ManualCurrencyRequestService.createManualCurrencyRequest(Object.assign(Object.assign({}, ManualCurrencyRequestData), { ownById: user.userId, status: client_1.EStatusOfManualCurrencyRequest.pending, dollarRate: config_1.default.manualDollarRate, receivedAmount: null }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'ManualCurrencyRequest Created successfully!',
        data: result,
    });
}));
const getAllManualCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...manualCurrencyRequest_constant_1.manualCurrencyRequestFilterAbleFields,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield manualCurrencyRequest_service_1.ManualCurrencyRequestService.getAllManualCurrencyRequest(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'ManualCurrencyRequest retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleManualCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield manualCurrencyRequest_service_1.ManualCurrencyRequestService.getSingleManualCurrencyRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'ManualCurrencyRequest retrieved  successfully!',
        data: result,
    });
}));
const updateManualCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const validUpdateAbleDate = {};
    const fields = [
        'status',
        'message',
        'receivedAmount',
    ];
    fields.forEach(field => {
        if (updateAbleData[field]) {
            validUpdateAbleDate[field] = updateAbleData[field];
        }
    });
    const result = yield manualCurrencyRequest_service_1.ManualCurrencyRequestService.updateManualCurrencyRequest(id, validUpdateAbleDate);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'ManualCurrencyRequest Updated successfully!',
        data: result,
    });
}));
const deleteManualCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield manualCurrencyRequest_service_1.ManualCurrencyRequestService.deleteManualCurrencyRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'ManualCurrencyRequest deleted successfully!',
        data: result,
    });
}));
exports.ManualCurrencyRequestController = {
    getAllManualCurrencyRequest,
    createManualCurrencyRequest,
    updateManualCurrencyRequest,
    getSingleManualCurrencyRequest,
    deleteManualCurrencyRequest,
};
