import { Router } from 'express';
import * as venuesController from '../controllers/venues-controller';
import auth from '../middleware/auth';

const router = Router();

router.get('/', venuesController.getVenues);

router.get('/:venueId', venuesController.getVenueById);

router.use(auth);

//router.post('/fetch', venuesController.createVenues);

export default router;
