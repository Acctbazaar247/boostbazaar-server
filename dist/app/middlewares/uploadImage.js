"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
// cloudinary config
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudName,
    api_key: config_1.default.cloudApiKey,
    api_secret: config_1.default.cloudApiSecret,
    secure: true,
});
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || !req.files.avatar) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image file not found!');
        }
        const file = req.files.avatar;
        const publicId = 'myfolder/images/' + file.name.split('.')[0] + '_' + Date.now();
        const result = yield uploadToCloudinary(file, publicId);
        req.body.uploadedImg = result;
        next();
    }
    catch (e) {
        next(e);
    }
});
function uploadToCloudinary(file, publicId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader
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
    });
}
exports.default = uploadImage;
