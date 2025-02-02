import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CryptoBankController } from './cryptoBank.controller';
import { CryptoBankValidation } from './cryptoBank.validation';
const router = express.Router();

router.get('/', CryptoBankController.getAllCryptoBank);
router.get('/:id', CryptoBankController.getSingleCryptoBank);

router.post(
  '/',
  auth(UserRole.admin),
  validateRequest(CryptoBankValidation.createValidation),
  CryptoBankController.createCryptoBank
);

router.patch(
  '/:id',
  auth(UserRole.admin),
  validateRequest(CryptoBankValidation.updateValidation),
  CryptoBankController.updateCryptoBank
);
router.delete(
  '/:id',
  auth(UserRole.admin),
  CryptoBankController.deleteCryptoBank
);

export const CryptoBankRoutes = router;
