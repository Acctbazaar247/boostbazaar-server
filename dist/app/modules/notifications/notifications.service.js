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
exports.NotificationsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ userId });
    const data = yield prisma_1.default.notifications.findMany({
        where: {
            ownById: userId,
        },
    });
    return data;
});
const createNotifications = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newNotifications = yield prisma_1.default.notifications.create({
        data: payload,
    });
    return newNotifications;
});
const getSingleNotifications = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notifications.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateNotifications = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notifications.updateMany({
        where: {
            ownById: id,
            isSeen: false,
        },
        data: { isSeen: true },
    });
    return result;
});
const deleteNotifications = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.notifications.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Notifications not found!');
    }
    return result;
});
exports.NotificationsService = {
    getAllNotifications,
    createNotifications,
    updateNotifications,
    getSingleNotifications,
    deleteNotifications,
};
