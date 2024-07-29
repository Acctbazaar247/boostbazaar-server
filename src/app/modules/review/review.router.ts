import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    UserRole.admin,
    UserRole.superAdmin,
    UserRole.prAdmin,
    UserRole.financeAdmin,
    UserRole.user,
    UserRole.seller,
    UserRole.ccAdmin
  ),
  ReviewController.getAllReview
);
router.get(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.superAdmin,
    UserRole.prAdmin,
    UserRole.financeAdmin,
    UserRole.user,
    UserRole.seller,
    UserRole.ccAdmin
  ),
  ReviewController.getSingleReview
);

router.post(
  '/',
  validateRequest(ReviewValidation.createValidation),
  auth(UserRole.seller, UserRole.user),
  ReviewController.createReview
);
router.post(
  '/add-reply',
  validateRequest(ReviewValidation.createReplyValidation),
  auth(UserRole.seller, UserRole.user),
  ReviewController.createReviewReply
);

// router.patch(
//   '/:id',
//   validateRequest(ReviewValidation.updateValidation),
//   ReviewController.updateReview
// );
router.delete('/:id', ReviewController.deleteReview);

export const ReviewRoutes = router;
