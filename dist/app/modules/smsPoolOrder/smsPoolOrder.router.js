"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsPoolOrderRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const smsPoolOrder_controller_1 = require("./smsPoolOrder.controller");
const smsPoolOrder_validation_1 = require("./smsPoolOrder.validation");
const router = express_1.default.Router();
router.get('/', smsPoolOrder_controller_1.SmsPoolOrderController.getAllSmsPoolOrder);
router.get('/:id', smsPoolOrder_controller_1.SmsPoolOrderController.getSingleSmsPoolOrder);
// router.post(
//   '/',
//   validateRequest(SmsPoolOrderValidation.createValidation),
//   SmsPoolOrderController.createSmsPoolOrder
// );
router.patch('/update-status/:id', (0, auth_1.default)(client_1.UserRole.admin), (0, validateRequest_1.default)(smsPoolOrder_validation_1.SmsPoolOrderValidation.updateValidation), smsPoolOrder_controller_1.SmsPoolOrderController.updateSmsPoolOrderStatus);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.user), (0, validateRequest_1.default)(smsPoolOrder_validation_1.SmsPoolOrderValidation.updateValidation), smsPoolOrder_controller_1.SmsPoolOrderController.updateSmsPoolOrder);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin), smsPoolOrder_controller_1.SmsPoolOrderController.deleteSmsPoolOrder);
exports.SmsPoolOrderRoutes = router;
