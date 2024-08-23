import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();
router.post(
  '/signup',
  validateRequest(AuthValidation.createAuthZodSchema),
  AuthController.createUser
);
router.post(
  '/signin',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

router.post(
  '/verify-signup-token',
  validateRequest(AuthValidation.verifyToken),
  auth(UserRole.admin, UserRole.user),
  AuthController.verifySignupToken
);
router.post(
  '/resend/:email',
  auth(UserRole.admin, UserRole.user),
  AuthController.resendEmail
);
router.post('/send-forgot-email/:email', AuthController.sendForgotEmail);
router.post(
  '/verify-forgot-token',
  validateRequest(AuthValidation.verifyForgotToken),
  AuthController.verifyForgotToken
);
router.post(
  '/change-password',
  validateRequest(AuthValidation.changePassword),
  AuthController.changePassword
);
export const AuthRoutes = router;
