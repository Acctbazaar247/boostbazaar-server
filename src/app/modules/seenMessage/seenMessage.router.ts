import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SeenMessageController } from './seenMessage.controller';
import { SeenMessageValidation } from './seenMessage.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user, UserRole.seller),
  SeenMessageController.getAllSeenMessage
);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user, UserRole.seller),
  SeenMessageController.getSingleSeenMessage
);

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.seller, UserRole.user),
  validateRequest(SeenMessageValidation.createValidation),
  SeenMessageController.createSeenMessage
);

router.patch(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user, UserRole.seller),
  validateRequest(SeenMessageValidation.updateValidation),
  SeenMessageController.updateSeenMessage
);
router.delete('/:id', SeenMessageController.deleteSeenMessage);

export const SeenMessageRoutes = router;
