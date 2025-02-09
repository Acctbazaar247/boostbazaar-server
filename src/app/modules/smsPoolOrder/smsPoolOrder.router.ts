import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SmsPoolOrderController } from './smsPoolOrder.controller';
import { SmsPoolOrderValidation } from './smsPoolOrder.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  SmsPoolOrderController.getAllSmsPoolOrder
);
router.get(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  SmsPoolOrderController.getSingleSmsPoolOrder
);

// router.post(
//   '/',
//   validateRequest(SmsPoolOrderValidation.createValidation),
//   SmsPoolOrderController.createSmsPoolOrder
// );

router.patch(
  '/update-status/:id',
  auth(UserRole.admin, UserRole.customerCare, UserRole.financeAdmin),
  validateRequest(SmsPoolOrderValidation.updateValidation),
  SmsPoolOrderController.updateSmsPoolOrderStatus
);
router.patch(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  validateRequest(SmsPoolOrderValidation.updateValidation),
  SmsPoolOrderController.updateSmsPoolOrder
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.customerCare, UserRole.financeAdmin),
  SmsPoolOrderController.deleteSmsPoolOrder
);

export const SmsPoolOrderRoutes = router;
