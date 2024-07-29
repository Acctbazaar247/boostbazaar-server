import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import httpStatus from 'http-status';
import config from '../../config';
import ApiError from '../../errors/ApiError';

// cloudinary config
cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudApiKey,
  api_secret: config.cloudApiSecret,
  secure: true,
});

const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files || !req.files.avatar) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Image file not found!');
    }

    const file = req.files.avatar as UploadedFile;
    const publicId =
      'myfolder/images/' + file.name.split('.')[0] + '_' + Date.now();
    const result = await uploadToCloudinary(file, publicId);
    req.body.uploadedImg = result;
    next();
  } catch (e) {
    next(e);
  }
};

async function uploadToCloudinary(file: UploadedFile, publicId: string) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload(file.tempFilePath, {
        resource_type: 'auto', // Automatically determine the resource type
        public_id: publicId,
      })
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export default uploadImage;
