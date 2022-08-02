import * as mongoose from 'mongoose';
import { deleteFile } from '../util/s3';
import MESSAGES from '../constants/messages';
import HttpError from '../models/http-error';
import VenueImage, { IVenueImageDoc } from '../models/venue-image';
import BaseRepository from './base-repository';
import UsersRepository from './users-repository';
import VenuesRepository from './venues-repository';
import { UploadImage } from 'util/upload-images';

class ImagesRepository extends BaseRepository<IVenueImageDoc> {
  constructor() {
    super(VenueImage);
  }

  async createImages(
    uploadedImages: UploadImage[],
    venueId: string,
    userId: string,
  ): Promise<{ createdImages?: IVenueImageDoc[]; error?: HttpError }> {
    const venuesRepository = new VenuesRepository();
    const usersRepository = new UsersRepository();

    const { result: venue, error: venueError } = await venuesRepository.readById(venueId);

    const { result: user, error: userError } = await usersRepository.readById(userId);

    if (venueError || userError) {
      return { error: venueError || userError };
    }

    if (!venue || !user) {
      return { error: new HttpError(MESSAGES.CREATE_FAILED, 404) };
    }

    const createdImages: IVenueImageDoc[] = [];

    for (const uploadedImage of uploadedImages) {
      const {key, url} = uploadedImage;
      const altText = venue.name + ' | ' + new Date().toLocaleDateString('de-DE');

      const createdImage = new VenueImage({
        imageKey: key,
        url,
        altText,
        user,
        venue,
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

        createdImages.push(createdImage);
      } catch (e) {
        return { error: new HttpError(MESSAGES.CREATE_FAILED, 500) };
      }
    }

    return { createdImages };
  }

  async deleteImage(imageId: string): Promise<{ isDeleted?: boolean; error?: HttpError }> {
    const { result: image, error } = await this.readByIdAndPopulate(imageId, ['user', 'venue']);

    if (error) {
      return { error };
    }

    if (!image) {
      return { error: new HttpError(MESSAGES.DELETE_FAILED, 404) };
    }

    try {
      await deleteFile(image.imageKey);
    } catch (e) {
      console.log(e);
      return { error: new HttpError(MESSAGES.DELETE_FAILED, 404) };
    }

    try {
      const session = await mongoose.startSession();
      session.startTransaction();

      await image.remove({ session });

      image.user.images.pull(image);
      image.venue.images.pull(image);

      await image.user.save({ session });
      await image.venue.save({ session });

      await session.commitTransaction();
    } catch (e) {
      return { error: new HttpError(MESSAGES.DELETE_FAILED, 500) };
    }

    return {
      isDeleted: true,
    };
  }
}

export default ImagesRepository;
