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
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  OrdersController.getAllOrders
);
router.get(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  OrdersController.getSingleOrders
);

router.post(
  '/',
  auth(UserRole.user),
  validateRequest(OrdersValidation.createValidation),
  OrdersController.createOrders
);

router.patch(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  validateRequest(OrdersValidation.updateValidation),
  OrdersController.updateOrders
);
router.delete(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  OrdersController.deleteOrders
);

export const OrdersRoutes = router;
