import * as mongoose from 'mongoose';

import MESSAGES from "../constants/messages";
import HttpError from "../models/http-error";
import VenueImage, { IVenueImageDoc } from "../models/venue-image";
import BaseRepository from "./base-repository";
import UsersRepository from './users-repository';
import VenuesRepository from "./venues-repository";

class ImagesRepository extends BaseRepository<IVenueImageDoc> {
    constructor() {
        super(VenueImage)
    }

    async createImage(filename: string, altText: string, venueId: string, userId: string): Promise<{ createdImage?: IVenueImageDoc, error?: HttpError }> {
        const venuesRepository = new VenuesRepository();
        const usersRepository = new UsersRepository();

        const { result: venue, error: venueError } = await venuesRepository.readById(venueId);

        const { result: user, error: userError } = await usersRepository.readById(userId);

        if (venueError || userError) {
            return { error: venueError || userError }
        }

        if (!venue || !user) {
            return { error: new HttpError(MESSAGES.CREATE_FAILED, 404) }
        }

        const createdImage = new VenueImage({
            filename,
            altText,
            user,
            venue
        })

        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            await createdImage.save({ session });

            venue.images.push(createdImage);                
            await venue.save({ session });

            user.images.push(createdImage);
            await user.save({ session });        

            await session.commitTransaction();
        } catch (e) {
            return { error: new HttpError(MESSAGES.CREATE_FAILED, 500) };
        }

        return { createdImage }
    }
}

export default ImagesRepository;