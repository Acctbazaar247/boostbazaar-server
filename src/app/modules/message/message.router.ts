import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { MessageController } from './message.controller';
import { MessageValidation } from './message.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user, UserRole.seller),
  MessageController.getAllMessage
);
router.get('/:id', MessageController.getSingleMessage);

router.post(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.user, UserRole.seller),
  validateRequest(MessageValidation.createValidation),
  MessageController.createMessage
);

router.patch(
  '/:id',
  validateRequest(MessageValidation.updateValidation),
  MessageController.updateMessage
);
router.delete('/:id', MessageController.deleteMessage);

export const MessageRoutes = router;
