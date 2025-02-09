import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SmsPoolController } from './smsPool.controller';
import { SmsPoolValidation } from './smsPool.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  SmsPoolController.getAllSmsPoolService
);
router.get(
  '/order/history',
  auth(
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin,
    UserRole.admin
  ),
  SmsPoolController.getAllOrderHistoryFromSmsPool
);
router.get(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  SmsPoolController.getSingleSmsPool
);
// router.post(
//   '/',
//   validateRequest(SmsPoolValidation.createValidation),
//   SmsPoolController.createSmsPool
// );

router.post(
  '/order',
  auth(UserRole.user),
  validateRequest(SmsPoolValidation.createSmsPoolOrderValidation),
  SmsPoolController.createSmsPoolOrder
);

export const SmsPoolRoutes = router;
