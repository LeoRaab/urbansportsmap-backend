import { Types } from 'mongoose';
import MESSAGES from '../constants/messages';
import HttpError from '../models/http-error';
import User, { IUserDoc } from '../models/user';
import { IVenueDoc } from '../models/venue';
import BaseRepository from './base-repository';
import VenuesRepository from './venues-repository';

class FavoritesRepository extends BaseRepository<IUserDoc> {
  constructor() {
    super(User);
  }

  async createFavorite(
    userId: string,
    venueId: string,
  ): Promise<{ favorites?: Types.Array<IVenueDoc>; error?: HttpError }> {
    const { user, venue, error } = await this.prepareFavorites(userId, venueId);

    if (error) {
      return { error };
    }

    if (!user) {
      return { error: new HttpError(MESSAGES.CREATE_FAILED, 404) };
    }

    if (!venue) {
      return { error: new HttpError(MESSAGES.CREATE_FAILED, 404) };
    }

    try {
      user.favorites.push(venue);
      await user.save();
      return { favorites: user.favorites };
    } catch (e) {
      return { error: new HttpError(MESSAGES.CREATE_FAILED, 500) };
    }
  }

  async deleteFavorite(
    userId: string,
    venueId: string,
  ): Promise<{ favorites?: Types.Array<IVenueDoc>; error?: HttpError }> {
    const { user, venue, error } = await this.prepareFavorites(userId, venueId);

    if (error) {
      return { error };
    }

    if (!user) {
      return { error: new HttpError(MESSAGES.DELETE_FAILED, 404) };
    }

    if (!venue) {
      return { error: new HttpError(MESSAGES.DELETE_FAILED, 404) };
    }

    try {
      user.favorites.pull(venue);
      await user.save();
      return { favorites: user.favorites };
    } catch (e) {
      return { error: new HttpError(MESSAGES.DELETE_FAILED, 500) };
    }
  }

  private async prepareFavorites(
    userId: string,
    venueId: string,
  ): Promise<{ user?: IUserDoc; venue?: IVenueDoc; error?: HttpError }> {
    const { result: user, error: userError } = await this.readById(userId);

    const venuesRepository = new VenuesRepository();
    const { result: venue, error: venueError } = await venuesRepository.readById(venueId);

    if (userError || venueError) {
      return { error: userError || venueError };
    }

    if (!user) {
      return { error: new HttpError(MESSAGES.NO_DATA_FOUND, 404) };
    }

    if (!venue) {
      return { error: new HttpError(MESSAGES.NO_DATA_FOUND, 404) };
    }

    return {
      user: user,
      venue: venue,
    };
  }
}

export default FavoritesRepository;
