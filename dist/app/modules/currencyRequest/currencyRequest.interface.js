"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOxWebhookStatus = exports.KoraPayEvent = void 0;
var KoraPayEvent;
(function (KoraPayEvent) {
    // eslint-disable-next-line no-unused-vars
    KoraPayEvent["PAYMENT_SUCCESS"] = "charge.success";
    // eslint-disable-next-line no-unused-vars
    KoraPayEvent["PAYMENT_FAILED"] = "charge.failed";
    // eslint-disable-next-line no-unused-vars
    KoraPayEvent["PAYMENT_PENDING"] = "charge.pending";
    // eslint-disable-next-line no-unused-vars
    KoraPayEvent["REFUND_SUCCESS"] = "refund.success";
    // eslint-disable-next-line no-unused-vars
    KoraPayEvent["REFUND_FAILED"] = "refund.failed";
})(KoraPayEvent || (exports.KoraPayEvent = KoraPayEvent = {}));
var EOxWebhookStatus;
(function (EOxWebhookStatus) {
    EOxWebhookStatus["Success"] = "Success";
    EOxWebhookStatus["Pending"] = "Pending";
    EOxWebhookStatus["Failed"] = "Failed";
})(EOxWebhookStatus || (exports.EOxWebhookStatus = EOxWebhookStatus = {}));
