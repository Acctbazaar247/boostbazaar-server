import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';
const router = express.Router();

router.get('/', ReviewController.getAllReview);
router.get('/:id', ReviewController.getSingleReview);

router.post(
  '/',
  auth(UserRole.admin, UserRole.user),
  validateRequest(ReviewValidation.createValidation),
  ReviewController.createReview
);

router.patch(
  '/:id',
  auth(UserRole.user),
  validateRequest(ReviewValidation.updateValidation),
  ReviewController.updateReview
);
router.delete('/:id', ReviewController.deleteReview);

export const ReviewRoutes = router;
