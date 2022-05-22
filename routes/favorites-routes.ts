import {Router} from 'express';
import * as favoritesController from '../controllers/favorites-controller';
import auth from '../middleware/auth';

const router = Router();

router.use(auth);

router.get('/', favoritesController.getFavorites);

router.post('/:venueId', favoritesController.createFavorite);

router.delete('/:venueId', favoritesController.deleteFavorite);

export default router;