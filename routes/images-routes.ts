import { Router } from "express";
import fileUpload from "../middleware/file-upload";
import * as imagesController from '../controllers/images-controller';
import auth from "../middleware/auth";
import checkUploadPath from "../middleware/check-upload-path";
import resizeImages from "../middleware/resize-images";

const router = Router();

router.get('/venue/:venueId', imagesController.getImagesByVenue);

router.use(auth);

router.get('/user', imagesController.getImagesByUser);

router.get('/venue/:venueId/user', imagesController.getImagesByVenueAndUser);

router.post('/:venueId', checkUploadPath, fileUpload.array('images'), resizeImages, imagesController.uploadImage);

router.delete('/:imageId', imagesController.deleteImage);

export default router;