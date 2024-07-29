import express from 'express';
import uploadImage from '../../middlewares/uploadImage';
import { fileUploadController } from './fileUpload.controller';

const router = express.Router();
router.post('/', uploadImage, fileUploadController.uploadSingleFile);

export const fileUploadRoutes = router;
