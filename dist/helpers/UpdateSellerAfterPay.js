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
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("../app/modules/auth/auth.service");
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const UpdateSellerAfterPay = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isSellerExits = yield prisma_1.default.user.findUnique({
        where: { id: data.order_id },
    });
    if (!isSellerExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    // if (isSellerExits.isApprovedForSeller && isSellerExits.isPaidForSeller) {
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     'User already been approved for seller and paid'
    //   );
    // }
    yield prisma_1.default.user.update({
        where: { id: isSellerExits.id },
        data: { isPaidForSeller: true, isApprovedForSeller: true, role: 'seller' },
    });
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // update admin
        try {
            const isAdminExist = yield tx.user.findUnique({
                where: { email: config_1.default.mainAdminEmail },
                include: { Currency: true },
            });
            if (!isAdminExist || !isAdminExist.Currency) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Admin doesn't exits");
            }
            // update amount
            yield tx.currency.update({
                where: { ownById: isAdminExist.id },
                data: {
                    amount: {
                        increment: config_1.default.sellerOneTimePayment,
                    },
                },
            });
        }
        catch (err) {
            console.log('something went wrong to ');
        }
        // send verification token
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const output = yield auth_service_1.AuthService.resendEmail(isSellerExits.email);
        // const { refreshToken, ...result } = output;
        // await sendEmail(
        //   { to: result.user.email },
        //   {
        //     subject: EmailTemplates.verify.subject,
        //     html: EmailTemplates.verify.html({ token: refreshToken as string }),
        //   }
        // );
    }));
});
exports.default = UpdateSellerAfterPay;
