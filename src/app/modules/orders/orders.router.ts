import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrdersController } from './orders.controller';
import { OrdersValidation } from './orders.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    UserRole.admin,
    UserRole.seller,
    UserRole.superAdmin,
    UserRole.user,
    UserRole.financeAdmin,
    UserRole.ccAdmin
  ),
  OrdersController.getAllOrders
);
router.get(
  '/my-orders',
  auth(UserRole.admin, UserRole.seller, UserRole.user),
  OrdersController.getMyOrders
);
router.get(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.superAdmin,
    UserRole.user,
    UserRole.seller,
    UserRole.financeAdmin,
    UserRole.ccAdmin
  ),
  OrdersController.getSingleOrders
);

router.post(
  '/',
  auth(UserRole.seller, UserRole.user),
  validateRequest(OrdersValidation.createValidation),
  OrdersController.createOrders
);

router.patch(
  '/:id',
  auth(UserRole.superAdmin, UserRole.financeAdmin, UserRole.ccAdmin),
  validateRequest(OrdersValidation.updateValidation),
  OrdersController.updateOrders
);
// router.delete('/:id', OrdersController.deleteOrders);

export const OrdersRoutes = router;
