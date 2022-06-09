import { Router } from "express";
import fileUpload from "../middleware/file-upload";
import * as imagesController from '../controllers/images-controller';
import auth from "../middleware/auth";
import checkUploadPath from "../middleware/check-upload-path";

const router = Router();

router.use(auth);

router.post('/:venueId', checkUploadPath, fileUpload.single('image'), imagesController.uploadImage);

export default router;