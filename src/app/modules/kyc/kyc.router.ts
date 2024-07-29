import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { KycController } from './kyc.controller';
import { KycValidation } from './kyc.validation';
const router = express.Router();

router.get(
  '/',
  // auth(UserRole.admin, UserRole.superAdmin),
  KycController.getAllKyc
);
router.get(
  '/single-user-kyc',
  auth(UserRole.seller),
  KycController.getSingleKycOfUser
);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.seller),
  KycController.getSingleKyc
);

router.post(
  '/',
  auth(UserRole.seller),
  validateRequest(KycValidation.createValidation),
  KycController.createKyc
);

router.patch(
  '/:id',
  auth(UserRole.seller, UserRole.admin, UserRole.superAdmin),
  validateRequest(KycValidation.updateValidation),
  KycController.updateKyc
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.seller),
  KycController.deleteKyc
);

export const KycRoutes = router;
