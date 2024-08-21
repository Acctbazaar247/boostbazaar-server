import express from 'express';
import { ServiceController } from './service.controller';
const router = express.Router();

router.get('/', ServiceController.getAllService);

export const ServiceRoutes = router;
