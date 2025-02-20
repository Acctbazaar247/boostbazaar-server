import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CurrencyRequestController } from './currencyRequest.controller';
import { CurrencyRequestValidation } from './currencyRequest.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  CurrencyRequestController.getAllCurrencyRequest
);
router.get(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  CurrencyRequestController.getSingleCurrencyRequest
);

// router.post(
//   '/',
//   auth(UserRole.seller, UserRole.user),
//   validateRequest(CurrencyRequestValidation.createValidation),
//   CurrencyRequestController.createCurrencyRequest
// );
router.post(
  '/flutterwave',
  auth(UserRole.user),
  validateRequest(CurrencyRequestValidation.createValidation),
  CurrencyRequestController.createCurrencyRequestWithFlutterwave
);
router.post(
  '/paystack',
  auth(UserRole.user),
  validateRequest(CurrencyRequestValidation.createValidation),
  CurrencyRequestController.createCurrencyRequestWithPayStack
);
router.post(
  '/korapay',
  auth(UserRole.user),
  validateRequest(CurrencyRequestValidation.createValidation),
  CurrencyRequestController.createCurrencyRequestWithKoraPay
);
router.post(
  '/nowpayment',
  auth(UserRole.user),
  validateRequest(CurrencyRequestValidation.createValidation),
  CurrencyRequestController.createCurrencyRequestInvoice
);

router.post('/webhook/paystack', CurrencyRequestController.payStackWebHook);
router.post(
  '/webhook/flutterwave',
  CurrencyRequestController.flutterwaveWebHook
);
router.post('/webhook/korapay', CurrencyRequestController.koraPayWebHook);
router.post(
  '/webhook/nowpayment',
  CurrencyRequestController.createCurrencyRequestIpn
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.customerCare, UserRole.financeAdmin),
  validateRequest(CurrencyRequestValidation.updateValidation),
  CurrencyRequestController.updateCurrencyRequest
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.customerCare, UserRole.financeAdmin),
  CurrencyRequestController.deleteCurrencyRequest
);

export const CurrencyRequestRoutes = router;
