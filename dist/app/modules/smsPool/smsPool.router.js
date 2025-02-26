"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsPoolRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const smsPool_controller_1 = require("./smsPool.controller");
const smsPool_validation_1 = require("./smsPool.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.user, client_1.UserRole.customerCare, client_1.UserRole.financeAdmin), smsPool_controller_1.SmsPoolController.getAllSmsPoolService);
router.get('/order/history', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.customerCare, client_1.UserRole.financeAdmin, client_1.UserRole.admin), smsPool_controller_1.SmsPoolController.getAllOrderHistoryFromSmsPool);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.user, client_1.UserRole.customerCare, client_1.UserRole.financeAdmin), smsPool_controller_1.SmsPoolController.getSingleSmsPool);
// router.post(
//   '/',
//   validateRequest(SmsPoolValidation.createValidation),
//   SmsPoolController.createSmsPool
// );
router.post('/order', (0, auth_1.default)(client_1.UserRole.user), (0, validateRequest_1.default)(smsPool_validation_1.SmsPoolValidation.createSmsPoolOrderValidation), smsPool_controller_1.SmsPoolController.createSmsPoolOrder);
exports.SmsPoolRoutes = router;
