"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const bank_controller_1 = require("./bank.controller");
const bank_validation_1 = require("./bank.validation");
const router = express_1.default.Router();
router.get('/', bank_controller_1.BankController.getAllBank);
router.get('/:id', bank_controller_1.BankController.getSingleBank);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin), (0, validateRequest_1.default)(bank_validation_1.BankValidation.createValidation), bank_controller_1.BankController.createBank);
router.patch('/:id', (0, validateRequest_1.default)(bank_validation_1.BankValidation.updateValidation), (0, auth_1.default)(client_1.UserRole.admin), bank_controller_1.BankController.updateBank);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin), bank_controller_1.BankController.deleteBank);
exports.BankRoutes = router;
