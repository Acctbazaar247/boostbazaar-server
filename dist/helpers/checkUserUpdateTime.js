"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
function checkUserUpdateTime(updatedAt) {
    const updatedAtTimestamp = updatedAt.getTime();
    const nowTimestamp = Date.now();
    const differenceMs = nowTimestamp - updatedAtTimestamp;
    const daysLeft = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const updateThresholdDays = 7;
    if (daysLeft >= updateThresholdDays) {
        return [true, daysLeft.toString() + ' days'];
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `you can update you name after ${(updateThresholdDays - daysLeft).toString() + ' days'}`);
    }
}
exports.default = checkUserUpdateTime;
