import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BankRoutes } from '../modules/bank/bank.router';
import { CryptoBankRoutes } from '../modules/cryptoBank/cryptoBank.router';
import { CurrencyRoutes } from '../modules/currency/currency.router';
import { CurrencyRequestRoutes } from '../modules/currencyRequest/currencyRequest.router';
import { fileUploadRoutes } from '../modules/fileUpload/fileUpload.route';
import { ManualCurrencyRequestRoutes } from '../modules/manualCurrencyRequest/manualCurrencyRequest.router';
import { OrdersRoutes } from '../modules/orders/orders.router';
import { ProfileRoutes } from '../modules/profile/profile.router';
import { ReferralRoutes } from '../modules/referral/referral.router';
import { ReviewRoutes } from '../modules/review/review.router';
import { ServiceRoutes } from '../modules/service/service.router';
import { SmsPoolRoutes } from '../modules/smsPool/smsPool.router';
import { SmsPoolOrderRoutes } from '../modules/smsPoolOrder/smsPoolOrder.router';
import { TicketsRoutes } from '../modules/tickets/tickets.router';
import { UserRoutes } from '../modules/user/user.router';
const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/currency',
    route: CurrencyRoutes,
  },
  {
    path: '/currency-request',
    route: CurrencyRequestRoutes,
  },
  {
    path: '/uploadImg',
    route: fileUploadRoutes,
  },
  {
    path: '/referral',
    route: ReferralRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/ticket',
    route: TicketsRoutes,
  },
  {
    path: '/service',
    route: ServiceRoutes,
  },
  {
    path: '/order',
    route: OrdersRoutes,
  },
  {
    path: '/sms-pool',
    route: SmsPoolRoutes,
  },
  {
    path: '/sms-pool-order',
    route: SmsPoolOrderRoutes,
  },
  {
    path: '/bank',
    route: BankRoutes,
  },
  {
    path: '/crypto-bank',
    route: CryptoBankRoutes,
  },
  {
    path: '/manual-currency-request',
    route: ManualCurrencyRequestRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
