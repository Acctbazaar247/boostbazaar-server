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
exports.CurrencyService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const lodash_1 = require("lodash");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const currency_constant_1 = require("./currency.constant");
const getAllCurrency = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = currency_constant_1.currencySearchableFields.map(single => {
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.currency.findMany({
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
    });
    const total = yield prisma_1.default.currency.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createCurrency = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newCurrency = yield prisma_1.default.currency.create({
        data: payload,
    });
    return newCurrency;
});
const getSingleCurrency = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.currency.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const getSingleCurrencyByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield prisma_1.default.currency.findUnique({
        where: {
            ownById: id,
        },
    });
    if (!result) {
        const isUserExist = yield prisma_1.default.user.findUnique({ where: { id } });
        if (isUserExist) {
            result = yield prisma_1.default.currency.create({
                data: { ownById: isUserExist.id, amount: 0 },
            });
        }
    }
    return result;
});
const updateCurrency = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    const isCurrencyExits = yield prisma_1.default.currency.findUnique({
        where: { ownById: id },
    });
    const amountToAdd = payload.amount || 0;
    if (!isCurrencyExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Currency not found!');
    }
    if (amountToAdd > 0) {
        result = yield prisma_1.default.currency.update({
            where: {
                ownById: id,
            },
            data: {
                amount: {
                    increment: amountToAdd,
                },
            },
        });
    }
    else if (amountToAdd < 0) {
        const newAmount = (0, lodash_1.round)(isCurrencyExits.amount + amountToAdd, 5);
        // if new amount is less then 0 then not allow
        if (newAmount < 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'New currency cannot be negative');
        }
        result = yield prisma_1.default.currency.update({
            where: {
                ownById: id,
            },
            data: {
                amount: {
                    decrement: Math.abs(amountToAdd),
                },
            },
        });
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong');
    }
    return result;
});
const deleteCurrency = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.currency.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Currency not found!');
    }
    return result;
});
exports.CurrencyService = {
    getAllCurrency,
    createCurrency,
    updateCurrency,
    getSingleCurrency,
    deleteCurrency,
    getSingleCurrencyByUserId,
};
