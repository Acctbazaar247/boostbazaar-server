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
const EmailTemplates_1 = __importDefault(require("../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const sendEmail_1 = __importDefault(require("./sendEmail"));
const sendEmailToEveryOne = ({ accountName, category, description, price, without, }) => __awaiter(void 0, void 0, void 0, function* () {
    const allEmail = yield prisma_1.default.user.findMany({
        where: {
            AND: [
                { shouldSendEmail: true, isVerified: true },
                {
                    NOT: {
                        email: {
                            in: without,
                        },
                    },
                },
            ],
        },
        select: {
            email: true,
        },
    });
    const allEmailString = allEmail.map(single => single.email);
    yield (0, sendEmail_1.default)({ to: 'da', multi: allEmailString }, {
        subject: EmailTemplates_1.default.newAccountAdded.subject,
        html: EmailTemplates_1.default.newAccountAdded.html({
            accountName,
            category,
            description,
            price,
        }),
    });
});
exports.default = sendEmailToEveryOne;
