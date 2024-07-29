import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PlanController } from './plan.controller';
import { PlanValidation } from './plan.validation';
const router = express.Router();

router.get('/', PlanController.getAllPlan);
router.get('/get-my-plan', auth(UserRole.seller), PlanController.getActivePlan);
router.get(
  '/get-how-many-upload-left',
  auth(UserRole.seller),
  PlanController.getHowManyUploadLeft
);
router.get('/:id', PlanController.getSinglePlan);

router.post(
  '/',
  auth(UserRole.seller),
  validateRequest(PlanValidation.createValidation),
  PlanController.createPlan
);

// router.patch(
//   '/:id',
//   validateRequest(PlanValidation.updateValidation),
//   PlanController.updatePlan
// );
// router.delete('/:id', PlanController.deletePlan);

export const PlanRoutes = router;
