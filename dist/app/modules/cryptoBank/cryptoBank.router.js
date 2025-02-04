"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoBankRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const cryptoBank_controller_1 = require("./cryptoBank.controller");
const cryptoBank_validation_1 = require("./cryptoBank.validation");
const router = express_1.default.Router();
router.get('/', cryptoBank_controller_1.CryptoBankController.getAllCryptoBank);
router.get('/:id', cryptoBank_controller_1.CryptoBankController.getSingleCryptoBank);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin), (0, validateRequest_1.default)(cryptoBank_validation_1.CryptoBankValidation.createValidation), cryptoBank_controller_1.CryptoBankController.createCryptoBank);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin), (0, validateRequest_1.default)(cryptoBank_validation_1.CryptoBankValidation.updateValidation), cryptoBank_controller_1.CryptoBankController.updateCryptoBank);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin), cryptoBank_controller_1.CryptoBankController.deleteCryptoBank);
exports.CryptoBankRoutes = router;
