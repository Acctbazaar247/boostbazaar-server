import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WithdrawalRequestController } from './withdrawalRequest.controller';
import { WithdrawalRequestValidation } from './withdrawalRequest.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    UserRole.admin,
    UserRole.seller,
    UserRole.user,
    UserRole.superAdmin,
    UserRole.financeAdmin
  ),
  WithdrawalRequestController.getAllWithdrawalRequest
);
router.get(
  '/single-user-request',
  auth(
    UserRole.admin,
    UserRole.seller,
    UserRole.user,
    UserRole.superAdmin,
    UserRole.financeAdmin
  ),
  WithdrawalRequestController.getSingleUserWithdrawalRequest
);
router.get('/withdrawal-banks', WithdrawalRequestController.getWithdrawalBank);
router.get(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.seller,
    UserRole.user,
    UserRole.superAdmin,
    UserRole.financeAdmin
  ),
  WithdrawalRequestController.getSingleWithdrawalRequest
);

router.post(
  '/',
  auth(UserRole.admin, UserRole.seller, UserRole.superAdmin, UserRole.user),
  validateRequest(WithdrawalRequestValidation.createValidation),
  WithdrawalRequestController.createWithdrawalRequest
);

router.patch(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.seller,
    UserRole.superAdmin,
    UserRole.financeAdmin
  ),
  validateRequest(WithdrawalRequestValidation.updateValidation),
  WithdrawalRequestController.updateWithdrawalRequest
);
router.delete('/:id', WithdrawalRequestController.deleteWithdrawalRequest);

export const WithdrawalRequestRoutes = router;
