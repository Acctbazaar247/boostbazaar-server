import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { ProfileController } from './profile.controller';
const router = express.Router();
router.get(
  '/',
  auth(UserRole.admin, UserRole.seller, UserRole.user, UserRole.superAdmin),
  ProfileController.getProfile
);

export const ProfileRoutes = router;
