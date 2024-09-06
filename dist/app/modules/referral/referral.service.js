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
exports.ReferralService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const referral_constant_1 = require("./referral.constant");
const getAllReferral = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = referral_constant_1.referralSearchableFields.map(single => {
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
    const result = yield prisma_1.default.referral.findMany({
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
            amount: true,
            createdAt: true,
            id: true,
            ownById: true,
            ownBy: {
                select: {
                    name: true,
                    profileImg: true,
                    id: true,
                    email: true,
                },
            },
            referralById: true,
            status: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_1.default.referral.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createReferral = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newReferral = yield prisma_1.default.referral.create({
        data: payload,
    });
    return newReferral;
});
const getSingleReferral = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.referral.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateReferral = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.referral.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteReferral = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.referral.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Referral not found!');
    }
    return result;
});
const sendReferralEmail = (userId, sendTo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!(user === null || user === void 0 ? void 0 : user.id)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    yield (0, sendEmail_1.default)({ to: sendTo }, {
        subject: `${user.name} Invites you to join Acctpanel`,
        html: EmailTemplates_1.default.sendReferral.html({
            link: `auth/sign-up?referralId=${userId}`,
        }),
    });
    return {
        isSend: true,
    };
});
exports.ReferralService = {
    getAllReferral,
    createReferral,
    updateReferral,
    getSingleReferral,
    deleteReferral,
    sendReferralEmail,
};
