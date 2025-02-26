"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const bank_router_1 = require("../modules/bank/bank.router");
const cryptoBank_router_1 = require("../modules/cryptoBank/cryptoBank.router");
const currency_router_1 = require("../modules/currency/currency.router");
const currencyRequest_router_1 = require("../modules/currencyRequest/currencyRequest.router");
const fileUpload_route_1 = require("../modules/fileUpload/fileUpload.route");
const manualCurrencyRequest_router_1 = require("../modules/manualCurrencyRequest/manualCurrencyRequest.router");
const orders_router_1 = require("../modules/orders/orders.router");
const profile_router_1 = require("../modules/profile/profile.router");
const referral_router_1 = require("../modules/referral/referral.router");
const review_router_1 = require("../modules/review/review.router");
const service_router_1 = require("../modules/service/service.router");
const smsPool_router_1 = require("../modules/smsPool/smsPool.router");
const smsPoolOrder_router_1 = require("../modules/smsPoolOrder/smsPoolOrder.router");
const tickets_router_1 = require("../modules/tickets/tickets.router");
const user_router_1 = require("../modules/user/user.router");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_router_1.UserRoutes,
    },
    {
        path: '/profile',
        route: profile_router_1.ProfileRoutes,
    },
    {
        path: '/currency',
        route: currency_router_1.CurrencyRoutes,
    },
    {
        path: '/currency-request',
        route: currencyRequest_router_1.CurrencyRequestRoutes,
    },
    {
        path: '/uploadImg',
        route: fileUpload_route_1.fileUploadRoutes,
    },
    {
        path: '/referral',
        route: referral_router_1.ReferralRoutes,
    },
    {
        path: '/review',
        route: review_router_1.ReviewRoutes,
    },
    {
        path: '/ticket',
        route: tickets_router_1.TicketsRoutes,
    },
    {
        path: '/service',
        route: service_router_1.ServiceRoutes,
    },
    {
        path: '/order',
        route: orders_router_1.OrdersRoutes,
    },
    {
        path: '/sms-pool',
        route: smsPool_router_1.SmsPoolRoutes,
    },
    {
        path: '/sms-pool-order',
        route: smsPoolOrder_router_1.SmsPoolOrderRoutes,
    },
    {
        path: '/bank',
        route: bank_router_1.BankRoutes,
    },
    {
        path: '/crypto-bank',
        route: cryptoBank_router_1.CryptoBankRoutes,
    },
    {
        path: '/manual-currency-request',
        route: manualCurrencyRequest_router_1.ManualCurrencyRequestRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
