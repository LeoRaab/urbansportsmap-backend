import {Router} from 'express';
import * as venuesController from '../controllers/venues-controller';

const router = Router();

router.get('/', venuesController.getVenues);

router.get('/:venueId', venuesController.getVenueById);

router.post('/fetch', venuesController.createVenues);

export default router;