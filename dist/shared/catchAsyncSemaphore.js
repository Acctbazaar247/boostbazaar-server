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
Object.defineProperty(exports, "__esModule", { value: true });
const async_sema_1 = require("async-sema");
const makeOrderSemaphore = new async_sema_1.Sema(1);
const catchAsyncSemaphore = (fn) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield makeOrderSemaphore.acquire();
        yield fn(req, res, next);
    }
    catch (error) {
        next(error);
    }
    finally {
        makeOrderSemaphore.release();
    }
});
exports.default = catchAsyncSemaphore;
