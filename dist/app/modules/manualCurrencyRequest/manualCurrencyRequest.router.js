"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualCurrencyRequestRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const manualCurrencyRequest_controller_1 = require("./manualCurrencyRequest.controller");
const manualCurrencyRequest_validation_1 = require("./manualCurrencyRequest.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.user), manualCurrencyRequest_controller_1.ManualCurrencyRequestController.getAllManualCurrencyRequest);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin), manualCurrencyRequest_controller_1.ManualCurrencyRequestController.getSingleManualCurrencyRequest);
router.post('/', (0, auth_1.default)(client_1.UserRole.user), (0, validateRequest_1.default)(manualCurrencyRequest_validation_1.ManualCurrencyRequestValidation.createValidation), manualCurrencyRequest_controller_1.ManualCurrencyRequestController.createManualCurrencyRequest);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin), (0, validateRequest_1.default)(manualCurrencyRequest_validation_1.ManualCurrencyRequestValidation.updateValidation), manualCurrencyRequest_controller_1.ManualCurrencyRequestController.updateManualCurrencyRequest);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin), manualCurrencyRequest_controller_1.ManualCurrencyRequestController.deleteManualCurrencyRequest);
exports.ManualCurrencyRequestRoutes = router;
