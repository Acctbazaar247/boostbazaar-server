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
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createBycryptPassword_1 = __importDefault(require("../../../helpers/createBycryptPassword"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const generateOTP_1 = require("../../../shared/generateOTP");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const user_service_1 = require("../user/user.service");
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // checking is user buyer
    const { password: givenPassword, referralId } = user, rest = __rest(user, ["password", "referralId"]);
    let newUser;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: user.email },
    });
    // check referralId
    if (referralId) {
        const isReferralUserExits = yield prisma_1.default.user.findUnique({
            where: { id: referralId },
            select: { id: true },
        });
        if (!isReferralUserExits) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Referral is not valid');
        }
    }
    // if seller and already exist
    const otp = (0, generateOTP_1.generateOtp)();
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isVerified) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user already Exits ');
    }
    else {
        const genarateBycryptPass = yield (0, createBycryptPassword_1.default)(givenPassword);
        // start new  transection  for new user
        // delete that user
        if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id) {
            yield user_service_1.UserService.deleteUser(isUserExist.id);
        }
        // start new  transection  for new user
        newUser = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            let role = client_1.UserRole.user;
            //gard for making super admin
            if ((user === null || user === void 0 ? void 0 : user.email) === config_1.default.mainAdminEmail) {
                role = client_1.UserRole.admin;
            }
            const newUserInfo = yield tx.user.create({
                data: Object.assign(Object.assign({ password: genarateBycryptPass }, rest), { role, isVerified: false }),
            });
            yield tx.currency.create({
                data: {
                    amount: 0,
                    ownById: newUserInfo.id,
                },
            });
            //this code is un useable
            // await tx.verificationOtp.deleteMany({
            //   where: { ownById: newUserInfo.id },
            // });
            yield tx.verificationOtp.create({
                data: {
                    ownById: newUserInfo.id,
                    otp: otp,
                    type: client_1.EVerificationOtp.createUser,
                },
            });
            if (referralId) {
                yield tx.referral.create({
                    data: {
                        ownById: newUserInfo.id,
                        referralById: referralId,
                        status: client_1.EReferralStatus.pending,
                        amount: config_1.default.referralAmount,
                    },
                });
            }
            // is is it seller
            return newUserInfo;
        }));
    }
    if (!newUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'failed to create user');
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, id, email, name } = newUser, others = __rest(newUser, ["password", "id", "email", "name"]);
    //create access token & refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role: newUser.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role: newUser.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name }, others),
        accessToken,
        refreshToken,
        otp,
    };
    // eslint-disable-next-line no-unused-vars
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: givenEmail, password } = payload;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.failedLoginAttempt && isUserExist.failedLoginAttempt >= 3) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "We noticed several attempts to access this account with an incorrect password. To protect your information, this account has been locked. Please reset your password using the 'Forgot Password' for enhanced security. ");
    }
    if (isUserExist.password &&
        !(yield bcryptjs_1.default.compare(password, isUserExist.password))) {
        if (isUserExist.failedLoginAttempt === null) {
            yield prisma_1.default.user.update({
                where: { id: isUserExist.id },
                data: {
                    failedLoginAttempt: 1,
                },
            });
        }
        else {
            yield prisma_1.default.user.update({
                where: { id: isUserExist.id },
                data: {
                    failedLoginAttempt: {
                        increment: 1,
                    },
                },
            });
        }
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    yield prisma_1.default.user.update({
        where: { id: isUserExist.id },
        data: { failedLoginAttempt: 0 },
    });
    //create access token & refresh token
    const { email, id, role, name } = isUserExist, others = __rest(isUserExist, ["email", "id", "role", "name"]);
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: Object.assign({ email, id, name, role }, others),
        accessToken,
        refreshToken,
    };
});
const resendEmail = (givenEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isVerified) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already verified');
    }
    const otp = (0, generateOTP_1.generateOtp)();
    const verificationOtp = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.verificationOtp.deleteMany({
            where: { ownById: isUserExist.id },
        });
        return yield tx.verificationOtp.create({
            data: {
                ownById: isUserExist.id,
                otp: otp,
                type: client_1.EVerificationOtp.createUser,
            },
        });
    }));
    if (!verificationOtp.id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot create verification Otp');
    }
    return {
        otp,
    };
});
const sendForgotEmail = (givenEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: givenEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const otp = (0, generateOTP_1.generateOtp)();
    //create access token & refresh token
    const { email } = isUserExist;
    const verificationOtp = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.verificationOtp.deleteMany({
            where: { ownById: isUserExist.id },
        });
        return yield tx.verificationOtp.create({
            data: {
                ownById: isUserExist.id,
                otp: otp,
                type: client_1.EVerificationOtp.forgotPassword,
            },
        });
    }));
    if (!verificationOtp.id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot create verification Otp');
    }
    yield (0, sendEmail_1.default)({ to: email }, {
        subject: EmailTemplates_1.default.verify.subject,
        html: EmailTemplates_1.default.verify.html({ token: otp }),
    });
    return {
        otp,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify to ken
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { id } = verifiedToken;
    // checking deleted user's refresh token
    const isUserExist = yield prisma_1.default.user.findFirst({ where: { id } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    //generate new Access token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const verifySignupToken = (token, userId) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    // checking deleted user's refresh token
    const isUserExist = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // check is token match and valid
    const isTokenExit = yield prisma_1.default.verificationOtp.findFirst({
        where: {
            ownById: userId,
            otp: token,
            type: client_1.EVerificationOtp.createUser,
        },
    });
    if (!isTokenExit) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OTP is not match');
    }
    // check time validation
    if ((0, generateOTP_1.checkTimeOfOTP)(isTokenExit.createdAt)) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OPT is expired!');
    }
    //generate new Access token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: isUserExist.id,
        role: isUserExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // delete all otp
    yield prisma_1.default.verificationOtp.deleteMany({
        where: { ownById: isUserExist.id },
    });
    const result = yield user_service_1.UserService.updateUser(isUserExist.id, {
        isVerified: true,
    }, {});
    if (!result) {
        new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const _a = result, { password } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: newAccessToken,
        user: rest,
    };
});
const verifyForgotToken = (token, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // check is token match and valid
    const isTokenExit = yield prisma_1.default.verificationOtp.findFirst({
        where: {
            ownById: isUserExist.id,
            otp: token,
            type: client_1.EVerificationOtp.forgotPassword,
        },
    });
    if (!isTokenExit) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OTP is not match');
    }
    // check time validation
    if ((0, generateOTP_1.checkTimeOfOTP)(isTokenExit.createdAt)) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OPT is expired!');
    }
    // delete all otp
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    return {
        token,
        isValidate: true,
    };
});
const changePassword = ({ password, email, prePassword, otp, }) => __awaiter(void 0, void 0, void 0, function* () {
    // checking is user buyer
    // check is token match and valid
    let result;
    const genarateBycryptPass = yield (0, createBycryptPassword_1.default)(password);
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: email },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    if (otp) {
        const isTokenExit = yield prisma_1.default.verificationOtp.findFirst({
            where: {
                ownById: isUserExist.id,
                otp,
                type: client_1.EVerificationOtp.forgotPassword,
            },
        });
        if (!isTokenExit) {
            throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OTP is not match');
        }
        if ((0, generateOTP_1.checkTimeOfOTP)(isTokenExit.createdAt)) {
            throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'OPT is expired!');
        }
        result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.verificationOtp.deleteMany({
                where: {
                    ownById: isUserExist.id,
                },
            });
            return yield tx.user.update({
                where: { id: isUserExist.id },
                data: { password: genarateBycryptPass, failedLoginAttempt: 0 },
            });
        }));
    }
    else {
        if (!prePassword) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'pre password in required!');
        }
        if (isUserExist.failedLoginAttempt) {
            if (isUserExist.failedLoginAttempt >= 3) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, `We noticed several attempts to access this account with an incorrect password. To protect your information, this account has been locked. Please reset your password using the Otp option for enhanced security.`);
            }
        }
        // check
        const isMatch = yield bcryptjs_1.default.compare(prePassword, isUserExist.password);
        if (!isMatch) {
            yield prisma_1.default.user.update({
                where: { id: isUserExist.id },
                data: {
                    failedLoginAttempt: isUserExist.failedLoginAttempt === null ? 0 : { increment: 1 },
                },
            });
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong password!');
        }
        result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.verificationOtp.deleteMany({
                where: {
                    ownById: isUserExist.id,
                },
            });
            return yield tx.user.update({
                where: { id: isUserExist.id },
                data: { password: genarateBycryptPass },
            });
        }));
    }
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong');
    }
    //create access token & refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: isUserExist.id, role: isUserExist.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: isUserExist.id, role: isUserExist.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        user: result,
        accessToken,
        refreshToken,
        otp,
    };
    // eslint-disable-next-line no-unused-vars
});
exports.AuthService = {
    createUser,
    loginUser,
    refreshToken,
    verifySignupToken,
    resendEmail,
    verifyForgotToken,
    changePassword,
    sendForgotEmail,
};
