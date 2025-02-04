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
//
const events_1 = __importDefault(require("events"));
const sendEmail_1 = __importDefault(require("../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../shared/EmailTemplates"));
// create events and handle sending email events
const emailEvents = new events_1.default();
emailEvents.on('send-manual-currency-request-email', (email, amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sendEmail_1.default)({ to: email }, {
        subject: EmailTemplates_1.default.manualCurrencyRequestApproved.subject,
        html: EmailTemplates_1.default.manualCurrencyRequestApproved.html({
            amount: amount,
        }),
    });
}));
emailEvents.on('send-manual-currency-request-email-to-admin', (email, amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sendEmail_1.default)({
        to: email,
        multi: [
            'brighteghove@gmail.com',
            'ezeokechinwendu@gmail.com',
            'ogbonnajanechinyere@gmail.com',
            //   'naimurrhman53@gmail.com',
        ],
    }, {
        subject: EmailTemplates_1.default.newManualCurrencyRequest.subject,
        html: EmailTemplates_1.default.newManualCurrencyRequest.html({
            amount: amount,
            email: email,
        }),
    });
}));
exports.default = emailEvents;
