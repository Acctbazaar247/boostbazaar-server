"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const notifications_controller_1 = require("./notifications.controller");
const notifications_validation_1 = require("./notifications.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.superAdmin, client_1.UserRole.user), notifications_controller_1.NotificationsController.getAllNotifications);
router.get('/:id', notifications_controller_1.NotificationsController.getSingleNotifications);
router.post('/', (0, validateRequest_1.default)(notifications_validation_1.NotificationsValidation.createValidation), notifications_controller_1.NotificationsController.createNotifications);
router.patch('/update-seen', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.seller, client_1.UserRole.superAdmin, client_1.UserRole.user), notifications_controller_1.NotificationsController.updateNotifications);
router.delete('/:id', notifications_controller_1.NotificationsController.deleteNotifications);
exports.NotificationsRoutes = router;
