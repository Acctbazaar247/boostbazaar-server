"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = exports.checkTimeOfOTP = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
// export default function generateOTP(): number {
//   const otp = Math.floor(1000 + Math.random() * 9000);
//   return otp;
// }
function checkTimeOfOTP(createdAt) {
    const thirtyMinutesInMilliseconds = 30 * 60 * 1000; // 30 minutes in milliseconds
    const currentTime = new Date();
    const createdAtTime = new Date(createdAt);
    const difference = currentTime.getTime() - createdAtTime.getTime();
    return difference >= thirtyMinutesInMilliseconds;
}
exports.checkTimeOfOTP = checkTimeOfOTP;
// eslint-disable-next-line no-unused-vars
const generateOtp = len => {
    const otp = otp_generator_1.default.generate(len || 6, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
    });
    return parseInt(otp);
};
exports.generateOtp = generateOtp;
