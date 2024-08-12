import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReferralController } from './referral.controller';
import { ReferralValidation } from './referral.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.user),
  ReferralController.getAllReferral
);
router.get('/:id', ReferralController.getSingleReferral);

router.post(
  '/send-invitation',
  auth(UserRole.admin, UserRole.user),
  validateRequest(ReferralValidation.invitation),
  ReferralController.sendReferralEmail
);

// router.patch(
//   '/:id',
//   validateRequest(ReferralValidation.updateValidation),
//   ReferralController.updateReferral
// );
// router.delete('/:id', ReferralController.deleteReferral);

export const ReferralRoutes = router;
