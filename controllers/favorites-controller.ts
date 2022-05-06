import {NextFunction, Request, Response} from 'express';
import User from '../models/user';
import HttpError from '../models/http-error';
import Venue from '../models/venue';
import {validationResult} from 'express-validator';

const getFavoritesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    let user;
    try {
        user = await User.findById(userId).populate('favorites');
    } catch (e) {
        return next(new HttpError('Fetching favorites failed, please try again later.', 500));
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id!', 404));
    }

    res.json({
        comments: user.toObject({ getters: true}).comments
    });
}

const createFavorite = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const venueId = req.params.venueId;
    const { userId } = req.body;

    let user;
    let venue;

    try {
        user = await User.findById(userId);
        venue = await Venue.findById(venueId);
    } catch (e) {
        return next(new HttpError('Creating favorite failed, please try again.', 500));
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id!', 404));
    }

    if (!venue) {
        return next(new HttpError('Could not find venue for provided id!', 404));
    }

    try {
        user.favorites.push(venue);
        user.save()
    } catch (e) {
        return next(new HttpError('Creating favorite failed, please try again!', 500));
    }

    res.status(201).json({
        favorite: {
            user,
            venue
        }
    });
}

const deleteFavorite = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const venueId = req.params.venueId;
    const { userId } = req.body;

    let user;
    let venue;

    try {
        user = await User.findById(userId);
        venue = await Venue.findById(venueId);
    } catch (e) {
        return next(new HttpError('Deleting favorite failed, please try again.', 500));
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id!', 404));
    }

    if (!venue) {
        return next(new HttpError('Could not find venue for provided id!', 404));
    }

    try {
        user.favorites.pull(venue);
        await user.save();
    } catch (e) {
        return next(new HttpError('Something went wrong, could not delete favorite.', 500));
    }

    res.json({
        message: 'Favorite has been deleted.'
    });
}

export {
    getFavoritesByUserId,
    createFavorite,
    deleteFavorite
}