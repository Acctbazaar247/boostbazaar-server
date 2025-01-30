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
exports.SmsPoolController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const smsPool_service_1 = require("./smsPool.service");
// const createSmsPool: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const SmsPoolData = req.body;
//     const result = await SmsPoolService.createSmsPool(SmsPoolData);
//     sendResponse<SmsPool>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'SmsPool Created successfully!',
//       data: result,
//     });
//   }
// );
const createSmsPoolOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SmsPoolOrderData = req.body;
    const user = req.user;
    const result = yield smsPool_service_1.SmsPoolService.createSmsPoolOrder(Object.assign(Object.assign({}, SmsPoolOrderData), { orderById: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SmsPoolOrder Created successfully!',
        data: result,
    });
}));
const getAllSmsPoolService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield smsPool_service_1.SmsPoolService.getAllSmsPool();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SmsPool retrieved successfully !',
        data: result,
    });
}));
const getSingleSmsPool = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield smsPool_service_1.SmsPoolService.getSingleSmsPoolServiceCountry(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SmsPool retrieved  successfully!',
        data: result,
    });
}));
exports.SmsPoolController = {
    getAllSmsPoolService,
    getSingleSmsPool,
    createSmsPoolOrder,
};
