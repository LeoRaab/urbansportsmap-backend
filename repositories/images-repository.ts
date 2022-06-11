import * as mongoose from 'mongoose';
import * as uuid from "uuid"
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

    async createImages(imageFilenames: string[], venueId: string, userId: string): Promise<{ createdImages?: IVenueImageDoc[], error?: HttpError }> {
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

        const createdImages: IVenueImageDoc[] = [];

        for (const filename of imageFilenames) {

            const altText = venue.name + ' | ' + new Date().toLocaleDateString();

            const createdImage = new VenueImage({
                filename,
                altText,
                user,
                venue
            });
    
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
        }
        

        return { createdImages }
    }
}

export default ImagesRepository;