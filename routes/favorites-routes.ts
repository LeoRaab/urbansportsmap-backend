import {Router} from 'express';
import * as favoritesController from '../controllers/favorites-controller';
import {check} from 'express-validator';

const router = Router();

router.get('/:userId', favoritesController.getFavoritesByUserId);

router.post('/:venueId',
    check('userId').isMongoId(),
    favoritesController.createFavorite);

router.delete('/:venueId',
    check('userId').isMongoId(),
    favoritesController.deleteFavorite);

export default router;