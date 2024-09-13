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
exports.OrdersService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const service_service_1 = require("../service/service.service");
const service_utils_1 = __importDefault(require("../service/service.utils"));
const orders_constant_1 = require("./orders.constant");
const getAllOrders = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = orders_constant_1.ordersSearchableFields.map(single => {
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
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.orders.findMany({
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
                    name: true,
                    profileImg: true,
                    id: true,
                    email: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.orders.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createOrders = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // get all service
    const allService = yield service_service_1.ServiceService.getAllService();
    const mainService = allService.find(single => single.service.toString() === payload.japServiceId);
    if (!mainService) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'service not found!');
    }
    const isLessThenMin = parseFloat(mainService.min) > payload.quantity;
    const isMoreThenMax = parseFloat(mainService.max) < payload.quantity;
    if (isLessThenMin || isMoreThenMax) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `The quantity cant be more then ${mainService.max} and less then ${mainService.min}`);
    }
    const increaseRatePrice = (config_1.default.japPercentage / 100) * parseFloat(mainService.rate);
    const sum = increaseRatePrice + parseFloat(mainService.rate);
    // 1000 is 1 unit
    const calculatePerUnitCost = sum / 1000;
    const cost = calculatePerUnitCost * payload.quantity;
    console.log(payload.orderById);
    const userCurrency = yield prisma_1.default.currency.findUnique({
        where: { ownById: payload.orderById },
    });
    if (!userCurrency) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user currency not found!');
    }
    // check user have that amount
    if (userCurrency.amount < cost) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `You don't have enough amount!`);
    }
    const admin = yield prisma_1.default.user.findFirst({
        where: { role: client_1.UserRole.admin, email: config_1.default.mainAdminEmail },
        select: {
            id: true,
        },
    });
    if (!(admin === null || admin === void 0 ? void 0 : admin.id)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong no admin found!');
    }
    // make order in jap
    const japOrderId = yield (0, service_utils_1.default)(payload.japServiceId, payload.link, payload.quantity);
    // const japOrderId = 'random';
    if (!japOrderId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'failed to make orders');
    }
    // make the order
    const output = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // cut seller amount
        const costNumber = parseFloat(Number(cost).toFixed(2));
        const userCurrencyUpdate = yield tx.currency.update({
            where: { ownById: payload.orderById },
            data: {
                amount: {
                    decrement: costNumber,
                },
            },
        });
        if (userCurrencyUpdate.amount < 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong');
        }
        // add amount to admin
        yield tx.currency.update({
            where: { ownById: admin.id },
            data: {
                amount: { increment: costNumber },
            },
        });
        const newOrders = yield tx.orders.create({
            data: Object.assign(Object.assign({}, payload), { japOrderId: japOrderId.toString(), charge: costNumber }),
        });
        return newOrders;
    }));
    const userEmail = yield prisma_1.default.user.findFirst({
        where: { id: payload.orderById },
        select: { email: true },
    });
    if (userEmail === null || userEmail === void 0 ? void 0 : userEmail.email) {
        (0, sendEmail_1.default)({ to: userEmail.email }, {
            subject: EmailTemplates_1.default.orderSuccessful.subject,
            html: EmailTemplates_1.default.orderSuccessful.html(),
        });
    }
    return output;
});
const getSingleOrders = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orders.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateOrders = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orders.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteOrders = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.orders.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Orders not found!');
    }
    return result;
});
exports.OrdersService = {
    getAllOrders,
    createOrders,
    updateOrders,
    getSingleOrders,
    deleteOrders,
};
