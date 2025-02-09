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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsPoolOrderService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const smsPoolRequest_1 = require("../../../helpers/smsPoolRequest");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const smsPoolOrder_constant_1 = require("./smsPoolOrder.constant");
const getAllSmsPoolOrder = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = smsPoolOrder_constant_1.smsPoolOrderSearchableFields.map(single => {
            const query = {
                [single]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            };
            return query;
        });
        andCondition.push({
            OR: searchAbleFields,
        });
    }
    if (Object.keys(filters).length) {
        andCondition.push({
            AND: Object.entries(filterData).map(([field, value]) => {
                // Check if the value is a string "true" or "false"
                if (value === 'true' || value === 'false') {
                    return { [field]: JSON.parse(value) };
                }
                return { [field]: value };
            }),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.smsPoolOrder.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            orderBy: {
                select: {
                    email: true,
                    name: true,
                    id: true,
                    profileImg: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.smsPoolOrder.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const updateSmsPoolOrder = (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const smsPoolOrder = yield prisma_1.default.smsPoolOrder.findUnique({
        where: {
            id,
        },
    });
    if (!smsPoolOrder) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'SmsPoolOrder not found');
    }
    // check user is admin or not
    if (user.role === client_1.UserRole.user) {
        // check user is owner of the order
        if (user.id !== (smsPoolOrder === null || smsPoolOrder === void 0 ? void 0 : smsPoolOrder.orderById)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not allowed to update this order');
        }
    }
    if (smsPoolOrder.status === client_1.ESmsPoolOrderStatus.completed) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not allowed to update completed order');
    }
    // check the order is pending and want to update status to refunded
    if (smsPoolOrder.status === client_1.ESmsPoolOrderStatus.pending &&
        payload.status === client_1.ESmsPoolOrderStatus.refunded) {
        const getThatHistory = yield smsPoolRequest_1.smsPoolRequest.getAllOrderHistory({
            orderId: smsPoolOrder.orderId,
        });
        if (!getThatHistory.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Data not found with orderId');
        }
        console.log(getThatHistory);
        try {
            const refundOrder = yield smsPoolRequest_1.smsPoolRequest.refundOrder({
                orderId: smsPoolOrder.orderId,
            });
            if (refundOrder.success === 0) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to refund order');
            }
        }
        catch (err) {
            console.log(err);
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to Refund order, Please try again');
        }
        // start a transaction
        const transaction = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // make a call to smsPoolRequest to refund the order
            // refund the money to user
            const refundMoney = yield tx.currency.update({
                where: { ownById: smsPoolOrder.orderById },
                data: { amount: { increment: Number(getThatHistory[0].cost) } },
            });
            return yield tx.smsPoolOrder.update({
                where: { id },
                data: { status: client_1.ESmsPoolOrderStatus.refunded },
            });
        }));
        return transaction;
    }
    // if(payload.status === ESmsPoolOrderStatus.)
    const result = yield prisma_1.default.smsPoolOrder.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const createSmsPoolOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newSmsPoolOrder = yield prisma_1.default.smsPoolOrder.create({
        data: payload,
    });
    return newSmsPoolOrder;
});
const getSingleSmsPoolOrder = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield prisma_1.default.smsPoolOrder.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not Found');
    }
    // get details form smsPool
    const getOrderHistory = yield smsPoolRequest_1.smsPoolRequest.getAllOrderHistory({
        orderId: result.orderId,
    });
    if (!getOrderHistory.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Data not found with orderId');
    }
    const smsPoolOrder = getOrderHistory[0];
    // handle sync
    if (result.status === client_1.ESmsPoolOrderStatus.pending &&
        smsPoolOrder.status === client_1.ESmsPoolOrderStatus.completed) {
        // update the status of the order
        const updatedOrder = yield prisma_1.default.smsPoolOrder.update({
            where: { id: result.id },
            data: { status: client_1.ESmsPoolOrderStatus.completed },
        });
        if (updatedOrder === null || updatedOrder === void 0 ? void 0 : updatedOrder.id) {
            console.log('sync to completed');
            result = updatedOrder;
        }
    }
    else if (result.status === client_1.ESmsPoolOrderStatus.pending &&
        smsPoolOrder.status === client_1.ESmsPoolOrderStatus.refunded) {
        const updateData = yield updateSmsPoolOrder(id, {
            status: client_1.ESmsPoolOrderStatus.refunded,
        }, userId);
        if (updateData === null || updateData === void 0 ? void 0 : updateData.id) {
            console.log('sync to refunded');
            result = updateData;
        }
    }
    // update the status of the order
    const mainResult = {
        info: result,
        details: getOrderHistory[0],
    };
    return mainResult;
});
const updateSmsPoolOrderStatus = (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const smsPoolOrder = yield prisma_1.default.smsPoolOrder.findUnique({
        where: {
            id,
        },
    });
    if (!smsPoolOrder) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'SmsPoolOrder not found');
    }
    // check user is admin or not
    if (user.role === client_1.UserRole.user) {
        // check user is owner of the order
        if (user.id !== (smsPoolOrder === null || smsPoolOrder === void 0 ? void 0 : smsPoolOrder.orderById)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not allowed to update this order');
        }
    }
    // if(payload.status === ESmsPoolOrderStatus.)
    const result = yield prisma_1.default.smsPoolOrder.update({
        where: {
            id,
        },
        data: {
            status: payload.status,
        },
    });
    return result;
});
const deleteSmsPoolOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.smsPoolOrder.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'SmsPoolOrder not found!');
    }
    return result;
});
exports.SmsPoolOrderService = {
    getAllSmsPoolOrder,
    createSmsPoolOrder,
    updateSmsPoolOrder,
    getSingleSmsPoolOrder,
    deleteSmsPoolOrder,
    updateSmsPoolOrderStatus,
};
