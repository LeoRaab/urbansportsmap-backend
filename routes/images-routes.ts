import { Router } from "express";
import fileUpload from "../middleware/file-upload";
import * as imagesController from '../controllers/images-controller';

const router = Router();

router.post('/:venueId', fileUpload.single('image'), imagesController.uploadImage);

export default router;