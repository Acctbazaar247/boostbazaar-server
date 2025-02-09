import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get(
  '/',
  // auth(UserRole.admin),
  UserController.getAllUser
);
router.get(
  '/admin/overview',
  auth(UserRole.admin, UserRole.financeAdmin, UserRole.customerCare),
  UserController.adminOverview
);
// router.get(
//   '/seller/overview',
//   auth(UserRole.seller),
//   UserController.sellerOverview
// );
// router.get(
//   '/seller/profile/:id',
//   auth(
//     UserRole.seller,
//     UserRole.admin,
//     UserRole.user,
//     UserRole.superAdmin,
//     UserRole.financeAdmin,
//     UserRole.ccAdmin,
//     UserRole.prAdmin
//   ),
//   UserController.sellerProfileInfo
// );
// router.get('/user/overview', auth(UserRole.user), UserController.userOverview);
router.post('/nowpayments-ipn', UserController.sellerIpn);
router.post(
  '/send-query',
  validateRequest(UserValidation.sendQueryValidation),
  auth(UserRole.admin, UserRole.user),
  UserController.sendUserQuery
);
router.get(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  UserController.getSingleUser
);

router.patch(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  validateRequest(UserValidation.updateValidation),
  UserController.updateUser
);
router.get('/info/spend', auth(UserRole.user), UserController.userSpend);
router.delete('/:id', auth(UserRole.admin), UserController.deleteUser);

export const UserRoutes = router;
