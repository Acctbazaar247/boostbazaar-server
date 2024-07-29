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
  auth(
    UserRole.admin,
    UserRole.superAdmin,
    UserRole.seller,
    UserRole.user,
    UserRole.prAdmin,
    UserRole.ccAdmin,
    UserRole.financeAdmin
  ),
  AuthController.verifySignupToken
);
router.post(
  '/resend/:email',
  auth(
    UserRole.admin,
    UserRole.superAdmin,
    UserRole.seller,
    UserRole.user,
    UserRole.prAdmin,
    UserRole.ccAdmin,
    UserRole.financeAdmin
  ),
  AuthController.resendEmail
);
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
router.post(
  '/add-withdrawal-password-first-time',
  validateRequest(AuthValidation.addWithdrawalPasswordFirstTime),
  auth(UserRole.seller, UserRole.user, UserRole.superAdmin, UserRole.admin),
  AuthController.addWithdrawalPasswordFirstTime
);
router.post(
  '/change-withdrawal-password',
  validateRequest(AuthValidation.changeWithdrawPin),
  auth(UserRole.seller, UserRole.user, UserRole.superAdmin, UserRole.admin),
  AuthController.changeWithdrawPin
);
router.post(
  '/send-withdrawal-password-forgot-token',
  auth(UserRole.seller),
  AuthController.sendWithdrawalTokenEmail
);
router.post('/send-forgot-email/:email', AuthController.sendForgotEmail);
router.post(
  '/become-seller',
  validateRequest(AuthValidation.becomeSeller),
  auth(UserRole.user),
  AuthController.becomeSeller
);
router.post(
  '/become-seller-with-wallet',
  auth(UserRole.user),
  AuthController.becomeSellerWithWallet
);
export const AuthRoutes = router;
