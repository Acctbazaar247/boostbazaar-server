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
exports.ManualCurrencyRequestService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const emailEvents_1 = __importDefault(require("../../events/emailEvents"));
const manualCurrencyRequest_constant_1 = require("./manualCurrencyRequest.constant");
const getAllManualCurrencyRequest = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = manualCurrencyRequest_constant_1.manualCurrencyRequestSearchableFields.map(single => {
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
    const result = yield prisma_1.default.manualCurrencyRequest.findMany({
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
        select: {
            id: true,
            message: true,
            image: true,
            requestedAmount: true,
            receivedAmount: true,
            ownById: true,
            status: true,
            accountName: true,
            accountNumber: true,
            bankName: true,
            transactionHash: true,
            dollarRate: true,
            createdAt: true,
            updatedAt: true,
            bankId: true,
            cryptoBankId: true,
            ownBy: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profileImg: true,
                },
            },
            bank: {
                select: {
                    id: true,
                    accountName: true,
                    accountNumber: true,
                    bankName: true,
                },
            },
            cryptoBank: {
                select: {
                    id: true,
                    walletAddress: true,
                    name: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.manualCurrencyRequest.count({
        where: whereConditions,
    });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createManualCurrencyRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: payload.ownById,
        },
        select: {
            id: true,
            email: true,
            name: true,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No user found');
    }
    // if bankId is provided then check is it exist on bank
    if (payload.bankId) {
        const isBankIdExist = yield prisma_1.default.bank.findUnique({
            where: {
                id: payload.bankId,
            },
        });
        if (!isBankIdExist) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Bank not found!');
        }
    }
    if (payload.cryptoBankId) {
        const isCryptoBankIdExist = yield prisma_1.default.cryptoBank.findUnique({
            where: {
                id: payload.cryptoBankId,
            },
        });
        if (!isCryptoBankIdExist) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'CryptoBank not found!');
        }
    }
    const newManualCurrencyRequest = yield prisma_1.default.manualCurrencyRequest.create({
        data: payload,
    });
    emailEvents_1.default.emit('send-manual-currency-request-email-to-admin', user.name, payload.requestedAmount);
    return newManualCurrencyRequest;
});
const getSingleManualCurrencyRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.manualCurrencyRequest.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateManualCurrencyRequest = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is data exist
    const isManualCurrencyRequestExist = yield prisma_1.default.manualCurrencyRequest.findUnique({
        where: {
            id,
        },
    });
    if (!isManualCurrencyRequestExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'ManualCurrencyRequest not found!');
    }
    // check is status is denied
    if (isManualCurrencyRequestExist.status ===
        client_1.EStatusOfManualCurrencyRequest.denied) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You can't update denied currency request");
    }
    // check is status already approved
    if (isManualCurrencyRequestExist.status ===
        client_1.EStatusOfManualCurrencyRequest.approved) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You can't update approved currency request");
    }
    // check is status is pending
    let result;
    if (payload.status === client_1.EStatusOfManualCurrencyRequest.approved) {
        result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = yield tx.user.findUnique({
                where: {
                    id: isManualCurrencyRequestExist.ownById,
                },
                select: {
                    id: true,
                    email: true,
                    Currency: {
                        select: {
                            id: true,
                            amount: true,
                        },
                    },
                },
            });
            if (!user) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
            }
            if (!((_a = user.Currency) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User Currency not found!');
            }
            let amountToIncrement = 0;
            if (payload.receivedAmount === null) {
                amountToIncrement = isManualCurrencyRequestExist.requestedAmount;
            }
            else if (payload.receivedAmount === undefined) {
                amountToIncrement = isManualCurrencyRequestExist.requestedAmount;
            }
            else {
                amountToIncrement = payload.receivedAmount;
            }
            // now safely increase user curreny
            const updateUserCurrency = yield tx.currency.update({
                where: {
                    id: user.Currency.id,
                },
                data: {
                    amount: {
                        increment: amountToIncrement,
                    },
                },
            });
            const output = yield tx.manualCurrencyRequest.update({
                where: {
                    id: isManualCurrencyRequestExist.id,
                },
                data: {
                    status: client_1.EStatusOfManualCurrencyRequest.approved,
                    receivedAmount: amountToIncrement,
                },
            });
            emailEvents_1.default.emit('send-manual-currency-request-email', user.email, amountToIncrement);
            return output;
        }));
    }
    else {
        result = yield prisma_1.default.manualCurrencyRequest.update({
            where: {
                id: isManualCurrencyRequestExist.id,
            },
            data: payload,
        });
    }
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong');
    }
    return result;
});
const deleteManualCurrencyRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.manualCurrencyRequest.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'ManualCurrencyRequest not found!');
    }
    return result;
});
exports.ManualCurrencyRequestService = {
    getAllManualCurrencyRequest,
    createManualCurrencyRequest,
    updateManualCurrencyRequest,
    getSingleManualCurrencyRequest,
    deleteManualCurrencyRequest,
};
