import * as mongoose from 'mongoose';

import MESSAGES from "../constants/messages";
import HttpError from "../models/http-error";
import VenueImage, { IVenueImageDoc } from "../models/venue-image";
import BaseRepository from "./base-repository";
import VenuesRepository from "./venues-repository";

class ImagesRepository extends BaseRepository<IVenueImageDoc> {
    constructor() {
        super(VenueImage)
    }

    async createImage(filename: string, altText: string, venueId: string): Promise<{ createdImage?: IVenueImageDoc, error?: HttpError }> {
        const venuesRepository = new VenuesRepository();

        const { result: venue, error } = await venuesRepository.readById(venueId)

        if (error) {
            return { error }
        }

        if (!venue) {
            return { error: new HttpError(MESSAGES.CREATE_FAILED, 404) }
        }

        const createdImage = new VenueImage({
            filename,
            altText
        })

        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            await createdImage.save({ session });

            venue.images.push(createdImage);

            await venue.save({ session });

            await session.commitTransaction();
        } catch (e) {
            return { error: new HttpError(MESSAGES.CREATE_FAILED, 500) };
        }

        return { createdImage }
    }
}

export default ImagesRepository;