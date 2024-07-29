import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { NotificationsController } from './notifications.controller';
import { NotificationsValidation } from './notifications.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.seller, UserRole.superAdmin, UserRole.user),
  NotificationsController.getAllNotifications
);
router.get('/:id', NotificationsController.getSingleNotifications);

router.post(
  '/',
  validateRequest(NotificationsValidation.createValidation),
  NotificationsController.createNotifications
);

router.patch(
  '/update-seen',
  auth(UserRole.admin, UserRole.seller, UserRole.superAdmin, UserRole.user),
  NotificationsController.updateNotifications
);
router.delete('/:id', NotificationsController.deleteNotifications);

export const NotificationsRoutes = router;
