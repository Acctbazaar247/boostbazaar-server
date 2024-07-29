/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_secret_signup: process.env.JWT_REFRESH_SECRET_SIGNUP,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  emailUserPass: process.env.EMAIL_USER_PASS,
  emailUser: process.env.EMAIL_USER,
  mainAdminEmail: process.env.MAIN_ADMIN_EMAIL,
  frontendUrl: process.env.FRONT_END_URL,
  sellerOneTimePayment: parseFloat(
    process.env.SELLER_ONE_TIME_PAYMENT as string
  ),
  currencyPerDollar: parseFloat(process.env.CURRENCY_PER_DOLLAR as string),
  withdrawalPercentage: parseFloat(process.env.WITHDRAWAL_PERCENTAGE as string),
  withdrawalMinMoney: parseFloat(process.env.WITHDRAWAL_MIN_MONEY as string),
  withdrawalMaxMoney: parseFloat(process.env.WITHDRAWAL_MAX_MONEY as string),
  calculationMoneyRound: parseInt(
    process.env.CALCULATION_MONEY_ROUND as string
  ),
  accountSellServiceCharge: parseFloat(
    process.env.ACCOUNT_SELL_SERVICE_CHARGE as string
  ),
  accountSellPercentage: parseFloat(
    process.env.ACCOUNT_SELL_PERCENTAGE as string
  ),
  dollarRate: parseFloat(process.env.DOLLAR_RATE as string),
  paystackPaymentApiKey: process.env.PAYSTACK_PAYMENT_API_KEY,
  nowPaymentApiKey: process.env.NOW_PAYMENT_API_KEY,
  nowPaymentInvoiceUrl: process.env.NOW_PAYMENT_INVOICE_URL,
  baseServerUrl: process.env.BASER_SERVER_URL,
  mainLogo: process.env.MAIN_LOGO,
  cloudName: process.env.CLOUD_NAME,
  cloudApiKey: process.env.CLOUD_API_KEY,
  cloudApiSecret: process.env.CLOUD_API_SECRET,
  flutterwave_public_key: process.env.FLUTTERWAVE_PUBLIC_KEY,

  defaultPlanLimit: parseInt(process.env.DEFAULT_PLAN_LIMIT as string),
  basicPlanLimit: parseInt(process.env.BASIC_PLAN_LIMIT as string),
  basicPlanPrice: parseFloat(process.env.BASIC_PLAN_PRICE as string),
  basicPlanDays: parseInt(process.env.PRO_PLAN_DAYS as string),

  proPlanPrice: parseFloat(process.env.PRO_PLAN_PRICE as string),
  proPlanLimit: parseInt(process.env.PRO_PLAN_LIMIT as string),
  proPlanDays: parseInt(process.env.PRO_PLAN_DAYS as string),

  proPlusPlanPrice: parseFloat(process.env.PRO_PLUS_PLAN_PRICE as string),
  proPlusPlanLimit: parseInt(process.env.PRO_PLUS_PLAN_LIMIT as string),
  proPlusPlanDays: parseInt(process.env.PRO_PLUS_PLAN_DAYS as string),

  referralAmount: parseInt(process.env.REFERRAL_AMOUNT as string),
  referralFirstPayAmount: parseInt(
    process.env.REFERRAL_FIRST_PAY_AMOUNT as string
  ),

  oneSignalID: process.env.ONESIGNAL_ID as string,
  oneSignalApi: process.env.ONESIGNAL_API as string,
};
