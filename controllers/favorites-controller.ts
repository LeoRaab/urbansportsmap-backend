import {NextFunction, Request, Response} from 'express';
import User from '../models/user';
import HttpError from '../models/http-error';
import Venue from '../models/venue';
import FavoritesRepository from '../repositories/favorites-repository';

const favoritesRepository = new FavoritesRepository();

const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const {result: user, error} = await favoritesRepository.readByIdAndPopulate(userId, 'favorites');

    if (error) {
        return next(error);
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id!', 404));
    }

    res.json({
        favorites: user.toObject({ getters: true}).favorites
    });
}

const createFavorite = async (req: Request, res: Response, next: NextFunction) => {
    const venueId = req.params.venueId;
    const userId = req.userId;

    const {favorites, error} = await favoritesRepository.createFavorite(userId, venueId);

    if (error) {
        return next(error);
    }

    if (!favorites) {
        return next(new HttpError('Creating favorite failed, please try again!', 500));
    }

    res.status(201).json({
        favorites
    });
}

const deleteFavorite = async (req: Request, res: Response, next: NextFunction) => {
    const venueId = req.params.venueId;
    const userId = req.userId;
    
    const {favorites, error} = await favoritesRepository.deleteFavorite(userId, venueId);

    if (error) {
        return next(error);
    }

    if (!favorites) {
        return next(new HttpError('Creating favorite failed, please try again!', 500));
    }

    res.json({
        favorites
    });
}

export {
    getFavorites,
    createFavorite,
    deleteFavorite
}