import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import HttpError from '../models/http-error';
import Venue from '../models/venue';
import FavoritesRepository from '../repositories/favorites-repository';
import MESSAGES from '../constants/messages';

const favoritesRepository = new FavoritesRepository();

const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  const { result: user, error } = await favoritesRepository.readByIdAndPopulate(userId, 'favorites');

  if (error) {
    return next(error);
  }

  if (!user) {
    return next(new HttpError(MESSAGES.NO_DATA_FOUND, 404));
  }

  res.json({
    favorites: user.toObject({ getters: true }).favorites,
  });
};

const createFavorite = async (req: Request, res: Response, next: NextFunction) => {
  const venueId = req.params.venueId;
  const userId = req.userId;

  const { favorites, error } = await favoritesRepository.createFavorite(userId, venueId);

  if (error) {
    return next(error);
  }

  if (!favorites) {
    return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
  }

  res.status(201).json({
    message: MESSAGES.CREATE_SUCCESSFUL,
    favorites,
  });
};

const deleteFavorite = async (req: Request, res: Response, next: NextFunction) => {
  const venueId = req.params.venueId;
  const userId = req.userId;

  const { favorites, error } = await favoritesRepository.deleteFavorite(userId, venueId);

  if (error) {
    return next(error);
  }

  if (!favorites) {
    return next(new HttpError(MESSAGES.DELETE_FAILED, 500));
  }

  res.json({
    message: MESSAGES.DELETE_SUCCESFUL,
    favorites,
  });
};

export { getFavorites, createFavorite, deleteFavorite };
