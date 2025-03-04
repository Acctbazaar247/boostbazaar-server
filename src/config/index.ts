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
  mainAdminEmail: process.env.MAIN_ADMIN_EMAIL as string,
  frontendUrl: process.env.FRONT_END_URL,

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
  cryptomus_key: process.env.CRYPTOMUS_API_KEY,
  smsPoolApiKey: process.env.SMSPOOL_API_KEY,
  referralAmount: parseInt(process.env.REFERRAL_AMOUNT as string),
  smsPoolServiceChargeInPercentage: parseFloat(
    process.env.SMSPOOL_SERVICE_CHARGE_IN_PERCENTAGE as string
  ),
  referralFirstPayAmount: parseInt(
    process.env.REFERRAL_FIRST_PAY_AMOUNT as string
  ),
  japApiKey: process.env.JAP_API_KEY,
  japUrl: 'https://justanotherpanel.com/api/v2',
  japPercentage: parseFloat(process.env.JAP_RATE_PERCENTAGE as string),
  manualDollarRate: parseFloat(process.env.MANUAL_DOLLAR_RATE as string),
  koraApiSecretKey: process.env.KORA_API_SECRET_KEY as string,
  oxAPIKey: process.env.OX_MERCHANT_KEY as string,
  oxProcessingWebHookPassword: process.env.OX_WEBHOOK_PASSWORD,
};
