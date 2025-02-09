import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CurrencyController } from './currency.controller';
import { CurrencyValidation } from './currency.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  CurrencyController.getAllCurrency
);
router.get(
  '/single-user-currency',
  auth(
    UserRole.admin,
    UserRole.user,
    UserRole.customerCare,
    UserRole.financeAdmin
  ),
  CurrencyController.getSingleCurrencyByUserId
);
// router.get('/:id', CurrencyController.getSingleCurrency);

router.post(
  '/',
  validateRequest(CurrencyValidation.createValidation),
  CurrencyController.createCurrency
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.financeAdmin),
  validateRequest(CurrencyValidation.updateValidation),
  CurrencyController.updateCurrency
);
// router.delete('/:id', CurrencyController.deleteCurrency);

export const CurrencyRoutes = router;
