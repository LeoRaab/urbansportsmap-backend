import { Router } from 'express';
import fileUpload from '../middleware/file-upload';
import * as imagesController from '../controllers/images-controller';
import auth from '../middleware/auth';

const router = Router();

router.get('/venue/:venueId', imagesController.getImagesByVenue);

router.use(auth);

router.get('/user', imagesController.getImagesByUser);

router.get('/venue/:venueId/user', imagesController.getImagesByVenueAndUser);

router.post('/:venueId', fileUpload.array('images'), imagesController.saveImages);

router.delete('/:imageId', imagesController.deleteImage);

export default router;
