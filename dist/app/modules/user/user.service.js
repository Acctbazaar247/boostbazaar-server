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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const UpdateSellerAfterPay_1 = __importDefault(require("../../../helpers/UpdateSellerAfterPay"));
const checkUserUpdateTime_1 = __importDefault(require("../../../helpers/checkUserUpdateTime"));
const createBycryptPassword_1 = __importDefault(require("../../../helpers/createBycryptPassword"));
const nowPaymentChecker_1 = __importDefault(require("../../../helpers/nowPaymentChecker"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const user_constant_1 = require("./user.constant");
const getAllUser = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = user_constant_1.userSearchableFields.map(single => {
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
                    equals: key === 'isApprovedForSeller'
                        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            JSON.parse(filterData[key])
                        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                id: 'desc',
            },
        select: {
            email: true,
            id: true,
            name: true,
            profileImg: true,
            role: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
            isBlocked: true,
            isApprovedForSeller: true,
            txId: true,
            shouldSendEmail: true,
            phoneNumber: true,
            isPaidForSeller: true,
            isVerifiedByAdmin: true,
            payWith: true,
            city: true,
            country: true,
            state: true,
            address: true,
            dateOfBirth: true,
            userName: true,
            Currency: {
                select: {
                    amount: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.user.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield prisma_1.default.user.create({
        data: payload,
    });
    return newUser;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    return result;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sellerIpn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.payment_status !== 'finished') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Sorry payment is not finished yet ');
    }
    yield (0, nowPaymentChecker_1.default)(data.payment_id);
    const { order_id, payment_status, price_amount } = data;
    yield (0, UpdateSellerAfterPay_1.default)({
        order_id,
        payment_status,
        price_amount,
    });
    // update user to vari
});
const updateUser = (id, payload, requestedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { password, isPaidForSeller, isApprovedForSeller } = payload, rest = __rest(payload, ["password", "isPaidForSeller", "isApprovedForSeller"]);
    let genarateBycryptPass;
    if (password) {
        genarateBycryptPass = yield (0, createBycryptPassword_1.default)(password);
    }
    const isUserExist = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    const isRoleExits = rest.role;
    const isRoleNotMatch = isUserExist.role !== rest.role;
    const isRequestedUSerNotSuperAdmin = requestedUser.role !== client_1.UserRole.superAdmin;
    if (isRoleExits && isRoleNotMatch && isRequestedUSerNotSuperAdmin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User role can only be changed by super admin');
    }
    const isUser = requestedUser.role !== client_1.UserRole.user;
    const isSeller = requestedUser.role !== client_1.UserRole.seller;
    if ((isUser || isSeller) && payload.isApprovedForSeller) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'only admin(ccAdmin,financeAdmin) can verify seller ');
    }
    if (isUserExist.role !== client_1.UserRole.superAdmin &&
        isUserExist.role !== client_1.UserRole.admin) {
        if (isUserExist.id === requestedUser.userId) {
            if (payload.name) {
                (0, checkUserUpdateTime_1.default)(isUserExist.updatedAt);
            }
        }
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: genarateBycryptPass
            ? Object.assign(Object.assign({}, rest), { password: genarateBycryptPass }) : rest,
    });
    // if admin update a seller verification send email
    if (payload.isApprovedForSeller && result.role === client_1.UserRole.seller) {
        yield (0, sendEmail_1.default)({ to: result.email }, {
            subject: EmailTemplates_1.default.sellerRequestAccepted.subject,
            html: EmailTemplates_1.default.sellerRequestAccepted.html(),
        });
    }
    console.log(payload);
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteUser = yield tx.user.delete({ where: { id } });
        return deleteUser;
    }));
});
const adminOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalAccount = yield prisma_1.default.account.count();
    const totalSoldAccount = yield prisma_1.default.account.count({
        where: { isSold: true },
    });
    const totalUser = yield prisma_1.default.user.count();
    const mainAdmin = yield prisma_1.default.user.findUnique({
        where: { email: config_1.default.mainAdminEmail },
        include: {
            Currency: { select: { amount: true } },
        },
    });
    if (!mainAdmin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Main admin Not found!');
    }
    const totalEarning = ((_a = mainAdmin.Currency) === null || _a === void 0 ? void 0 : _a.amount) || 0;
    const totalSellerAmount = yield prisma_1.default.currency.aggregate({
        where: {
            ownBy: {
                role: 'seller',
            },
        },
        _sum: {
            amount: true,
        },
    });
    const totalUserAmount = yield prisma_1.default.currency.aggregate({
        where: {
            ownBy: {
                role: 'user',
            },
        },
        _sum: {
            amount: true,
        },
    });
    return {
        totalAccount,
        totalSoldAccount,
        totalUser,
        totalEarning,
        totalUserAmount: totalUserAmount._sum.amount || 0,
        totalSellerAmount: totalSellerAmount._sum.amount || 0,
    };
});
const sellerOverview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const totalAccount = yield prisma_1.default.account.count({ where: { ownById: id } });
    const totalAccountApprove = yield prisma_1.default.account.count({
        where: { ownById: id, approvedForSale: 'approved' },
    });
    const totalSoldAccount = yield prisma_1.default.account.count({
        where: { isSold: true, ownById: id },
    });
    const totalOrder = yield prisma_1.default.orders.count({ where: { orderById: id } });
    const currency = yield prisma_1.default.currency.findUnique({
        where: { ownById: id },
    });
    const totalMoney = (currency === null || currency === void 0 ? void 0 : currency.amount) || 0;
    const totalWithdraw = yield prisma_1.default.withdrawalRequest.aggregate({
        where: {
            status: 'approved',
            ownById: id,
        },
        _sum: {
            amount: true,
        },
    });
    const totalFundWallet = yield prisma_1.default.currencyRequest.aggregate({
        where: {
            status: 'approved',
            ownById: id,
        },
        _sum: {
            amount: true,
        },
    });
    console.log(totalWithdraw);
    const today = new Date();
    const pastYearDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const pastYearData = yield prisma_1.default.account.findMany({
        where: {
            createdAt: {
                gte: pastYearDate,
                lte: today,
            },
            isSold: true,
            ownById: id,
        },
        select: {
            price: true,
            Orders: {
                select: {
                    createdAt: true,
                },
            },
        },
    });
    return {
        totalAccount,
        totalSoldAccount,
        totalOrder,
        totalMoney,
        totalWithdraw: totalWithdraw._sum.amount || 0,
        totalAccountApprove,
        totalFundWallet: totalFundWallet._sum.amount || 0,
        pastYearData: pastYearData || [],
    };
});
const sellerProfileInfo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isSellerExist = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            name: true,
            id: true,
            profileImg: true,
            isVerifiedByAdmin: true,
            country: true,
            createdAt: true,
        },
    });
    if (!isSellerExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Seller doesn't exist");
    }
    const totalAccountApprove = yield prisma_1.default.account.count({
        where: { ownById: id, approvedForSale: 'approved' },
    });
    const totalSoldAccount = yield prisma_1.default.account.count({
        where: { isSold: true, ownById: id },
    });
    const totalCancelOrder = yield prisma_1.default.orders.count({
        where: {
            account: {
                ownById: id,
            },
            status: client_1.EOrderStatus.cancelled,
        },
    });
    const totalOrder = yield prisma_1.default.orders.count({ where: { orderById: id } });
    const totalReviews = yield prisma_1.default.review.count({ where: { sellerId: id } });
    const totalPositiveReviews = yield prisma_1.default.review.count({
        where: { sellerId: id, reviewStatus: client_1.EReviewStatus.positive },
    });
    const totalNegativeReviews = yield prisma_1.default.review.count({
        where: { sellerId: id, reviewStatus: client_1.EReviewStatus.negative },
    });
    return {
        totalSoldAccount,
        totalOrder,
        totalAccountApprove,
        totalCancelOrder: totalCancelOrder,
        totalPositiveReviews,
        totalNegativeReviews,
        totalReviews,
        sellerInfo: Object.assign({}, isSellerExist),
    };
});
const userOverview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const totalOrder = yield prisma_1.default.orders.count({ where: { orderById: id } });
    const totalAccountOnCart = yield prisma_1.default.cart.count({
        where: { ownById: id },
    });
    // const totalOrder = await prisma.account.count({ where: { ownById: id } });
    const currency = yield prisma_1.default.currency.findUnique({
        where: { ownById: id },
    });
    const totalMoney = (currency === null || currency === void 0 ? void 0 : currency.amount) || 0;
    return {
        totalOrder,
        totalAccountOnCart,
        totalMoney,
    };
});
const sendUserQuery = (id, description, queryType) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found!');
    }
    // const transport = await nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: config.emailUser,
    //     pass: config.emailUserPass,
    //   },
    // });
    const transport = yield nodemailer_1.default.createTransport({
        host: 'mail.privateemail.com', // or 'smtp.privateemail.com'
        port: 465, // or 465 for SSL. or 587
        secure: true, // true for 465, false for 587
        auth: {
            user: config_1.default.emailUser,
            pass: config_1.default.emailUserPass,
        },
        tls: {
            // Enable TLS encryption
            ciphers: 'SSLv3',
        },
    });
    // send mail with defined transport object
    const mailOptions = {
        from: config_1.default.emailUser,
        to: config_1.default.emailUser,
        subject: `${isUserExist.name} asked a Query about ${queryType}`,
        text: `
    This query asked from ${isUserExist.email}

    The query:${description}
    `,
    };
    try {
        yield transport.sendMail(Object.assign({}, mailOptions));
        console.log(' success');
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Sorry try again after some time');
    }
});
exports.UserService = {
    getAllUser,
    createUser,
    updateUser,
    getSingleUser,
    deleteUser,
    sendUserQuery,
    sellerIpn,
    adminOverview,
    sellerOverview,
    userOverview,
    sellerProfileInfo,
};
