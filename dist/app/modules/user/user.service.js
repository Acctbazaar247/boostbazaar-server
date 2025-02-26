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
const date_fns_1 = require("date-fns");
const http_status_1 = __importDefault(require("http-status"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createBycryptPassword_1 = __importDefault(require("../../../helpers/createBycryptPassword"));
const nowPaymentChecker_1 = __importDefault(require("../../../helpers/nowPaymentChecker"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const smsPoolRequest_1 = require("../../../helpers/smsPoolRequest");
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
            shouldSendEmail: true,
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
    // const { order_id, payment_status, price_amount } = data;
    // await UpdateSellerAfterPay({
    //   order_id,
    //   payment_status,
    //   price_amount,
    // });
    // update user to vari
});
const updateUser = (id, payload, requestedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { password } = payload, rest = __rest(payload, ["password"]);
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
    const isRequestedUSerNotSuperAdmin = requestedUser.role !== client_1.UserRole.admin;
    if (isRoleExits && isRoleNotMatch && isRequestedUSerNotSuperAdmin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User role can only be changed by super admin');
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: genarateBycryptPass
            ? Object.assign(Object.assign({}, rest), { password: genarateBycryptPass }) : rest,
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteUser = yield tx.user.delete({ where: { id } });
        return deleteUser;
    }));
});
const adminOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const startOfToday = (0, date_fns_1.startOfDay)(new Date());
    const endOfToday = (0, date_fns_1.endOfDay)(new Date());
    const [totalOrder, totalSale, totalTodaySale, totalUser, countsByCategory, smsPoolBalance,] = yield Promise.all([
        prisma_1.default.orders.count({
            where: { status: client_1.EOrderStatus.completed },
        }),
        prisma_1.default.orders.aggregate({
            _sum: {
                charge: true,
            },
        }),
        prisma_1.default.orders.aggregate({
            _sum: {
                charge: true,
            },
            where: {
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        }),
        prisma_1.default.user.count(),
        prisma_1.default.orders.groupBy({
            by: ['accountCategory'],
            _count: {
                id: true,
            },
        }),
        smsPoolRequest_1.smsPoolRequest.getBalance(),
    ]);
    const trafic = countsByCategory.map(category => ({
        accountCategory: category.accountCategory,
        count: category._count.id,
    }));
    return {
        totalUser,
        totalOrder,
        totalSale: totalSale._sum.charge || 0,
        totalTodaySale: totalTodaySale._sum.charge || 0,
        trafic: trafic,
        smsPoolBalance: smsPoolBalance.balance,
    };
});
const userSpend = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const totalCharge = yield prisma_1.default.orders.aggregate({
        _sum: {
            charge: true,
        },
        where: {
            orderById: payload, // Replace this with the actual ID you want to filter by
        },
    });
    return {
        spend: totalCharge._sum.charge || 0,
    };
});
// const sellerOverview = async (id: string): Promise<TSellerOverview | null> => {
//   const totalAccount = await prisma.account.count({ where: { ownById: id } });
//   const totalAccountApprove = await prisma.account.count({
//     where: { ownById: id, approvedForSale: 'approved' },
//   });
//   const totalSoldAccount = await prisma.account.count({
//     where: { isSold: true, ownById: id },
//   });
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const currency = await prisma.currency.findUnique({
//     where: { ownById: id },
//   });
//   const totalMoney = currency?.amount || 0;
//   const totalWithdraw = await prisma.withdrawalRequest.aggregate({
//     where: {
//       status: 'approved',
//       ownById: id,
//     },
//     _sum: {
//       amount: true,
//     },
//   });
//   const totalFundWallet = await prisma.currencyRequest.aggregate({
//     where: {
//       status: 'approved',
//       ownById: id,
//     },
//     _sum: {
//       amount: true,
//     },
//   });
//   console.log(totalWithdraw);
//   const today = new Date();
//   const pastYearDate = new Date(
//     today.getFullYear() - 1,
//     today.getMonth(),
//     today.getDate()
//   );
//   const pastYearData = await prisma.account.findMany({
//     where: {
//       createdAt: {
//         gte: pastYearDate,
//         lte: today,
//       },
//       isSold: true,
//       ownById: id,
//     },
//     select: {
//       price: true,
//       Orders: {
//         select: {
//           createdAt: true,
//         },
//       },
//     },
//   });
//   return {
//     totalAccount,
//     totalSoldAccount,
//     totalOrder,
//     totalMoney,
//     totalWithdraw: totalWithdraw._sum.amount || 0,
//     totalAccountApprove,
//     totalFundWallet: totalFundWallet._sum.amount || 0,
//     pastYearData: pastYearData || [],
//   };
// };
// const sellerProfileInfo = async (
//   id: string
// ): Promise<TSellerProfileInfo | null> => {
//   const isSellerExist = await prisma.user.findUnique({
//     where: { id },
//     select: {
//       name: true,
//       id: true,
//       profileImg: true,
//       isVerifiedByAdmin: true,
//       country: true,
//       createdAt: true,
//     },
//   });
//   if (!isSellerExist) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Seller doesn't exist");
//   }
//   const totalAccountApprove = await prisma.account.count({
//     where: { ownById: id, approvedForSale: 'approved' },
//   });
//   const totalSoldAccount = await prisma.account.count({
//     where: { isSold: true, ownById: id },
//   });
//   const totalCancelOrder = await prisma.orders.count({
//     where: {
//       account: {
//         ownById: id,
//       },
//       status: EOrderStatus.cancelled,
//     },
//   });
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const totalReviews = await prisma.review.count({ where: { sellerId: id } });
//   const totalPositiveReviews = await prisma.review.count({
//     where: { sellerId: id, reviewStatus: EReviewStatus.positive },
//   });
//   const totalNegativeReviews = await prisma.review.count({
//     where: { sellerId: id, reviewStatus: EReviewStatus.negative },
//   });
//   return {
//     totalSoldAccount,
//     totalOrder,
//     totalAccountApprove,
//     totalCancelOrder: totalCancelOrder,
//     totalPositiveReviews,
//     totalNegativeReviews,
//     totalReviews,
//     sellerInfo: {
//       ...isSellerExist,
//     },
//   };
// };
// const userOverview = async (id: string): Promise<TUserOverview | null> => {
//   const totalOrder = await prisma.orders.count({ where: { orderById: id } });
//   const totalAccountOnCart = await prisma.cart.count({
//     where: { ownById: id },
//   });
//   // const totalOrder = await prisma.account.count({ where: { ownById: id } });
//   const currency = await prisma.currency.findUnique({
//     where: { ownById: id },
//   });
//   const totalMoney = currency?.amount || 0;
//   return {
//     totalOrder,
//     totalAccountOnCart,
//     totalMoney,
//   };
// };
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
    userSpend,
};
