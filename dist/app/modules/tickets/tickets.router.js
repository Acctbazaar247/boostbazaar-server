"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const tickets_controller_1 = require("./tickets.controller");
const tickets_validation_1 = require("./tickets.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin), tickets_controller_1.TicketsController.getAllTickets);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin), tickets_controller_1.TicketsController.getSingleTickets);
router.post('/', (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin), (0, validateRequest_1.default)(tickets_validation_1.TicketsValidation.createValidation), tickets_controller_1.TicketsController.createTickets);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.admin), (0, validateRequest_1.default)(tickets_validation_1.TicketsValidation.updateValidation), tickets_controller_1.TicketsController.updateTickets);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin), tickets_controller_1.TicketsController.deleteTickets);
exports.TicketsRoutes = router;
