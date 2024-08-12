import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TicketsController } from './tickets.controller';
import { TicketsValidation } from './tickets.validation';
const router = express.Router();

router.get('/', auth(UserRole.admin), TicketsController.getAllTickets);
router.get('/:id', auth(UserRole.admin), TicketsController.getSingleTickets);

router.post(
  '/',
  auth(UserRole.user, UserRole.admin),
  validateRequest(TicketsValidation.createValidation),
  TicketsController.createTickets
);

router.patch(
  '/:id',
  auth(UserRole.admin),
  validateRequest(TicketsValidation.updateValidation),
  TicketsController.updateTickets
);
router.delete('/:id', auth(UserRole.admin), TicketsController.deleteTickets);

export const TicketsRoutes = router;
