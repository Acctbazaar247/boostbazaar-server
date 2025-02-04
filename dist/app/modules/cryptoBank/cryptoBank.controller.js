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
exports.CryptoBankController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const cryptoBank_service_1 = require("./cryptoBank.service");
const cryptoBank_constant_1 = require("./cryptoBank.constant");
const createCryptoBank = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const CryptoBankData = req.body;
    const result = yield cryptoBank_service_1.CryptoBankService.createCryptoBank(CryptoBankData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CryptoBank Created successfully!',
        data: result,
    });
}));
const getAllCryptoBank = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...cryptoBank_constant_1.cryptoBankFilterAbleFields,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield cryptoBank_service_1.CryptoBankService.getAllCryptoBank(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CryptoBank retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleCryptoBank = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield cryptoBank_service_1.CryptoBankService.getSingleCryptoBank(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CryptoBank retrieved  successfully!',
        data: result,
    });
}));
const updateCryptoBank = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield cryptoBank_service_1.CryptoBankService.updateCryptoBank(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CryptoBank Updated successfully!',
        data: result,
    });
}));
const deleteCryptoBank = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield cryptoBank_service_1.CryptoBankService.deleteCryptoBank(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CryptoBank deleted successfully!',
        data: result,
    });
}));
exports.CryptoBankController = {
    getAllCryptoBank,
    createCryptoBank,
    updateCryptoBank,
    getSingleCryptoBank,
    deleteCryptoBank,
};
