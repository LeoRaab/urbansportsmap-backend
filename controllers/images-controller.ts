import { Request, Response, NextFunction } from "express";
import MESSAGES from "../constants/messages";
import HttpError from "../models/http-error";
import VenueImage, { IVenueImageDoc } from "../models/venue-image";
import ImagesRepository from "../repositories/images-repository";

const imagesRepository = new ImagesRepository();

const getImagesByVenue = async (req: Request, res: Response, next: NextFunction) => {
    const venueId = req.params.venueId;

    const { result: images, error } = await imagesRepository.readAll({ venue: venueId });

    if (error) {
        return next(error);
    }

    if (!images) {
        return next(new HttpError(MESSAGES.NO_DATA_FOUND, 404));
    }

    res.json({
        images: images.map((image: IVenueImageDoc) => image.toObject({ getters: true }))
    });
}

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    /*
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError(MESSAGES.INVALID_INPUT, 422));
    }
    */

    const { altText } = req.body;
    const venueId = req.params.venueId;
    const userId = req.userId;

    if (!req.file) {
        return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
    }    

    const filename = req.file.filename;

    const { createdImage, error } = await imagesRepository.createImage(filename, altText, venueId, userId);

    if (error) {
        return next(error);
    }

    if (!createdImage) {
        return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
    }

    res.status(201).json({
        message: MESSAGES.CREATE_SUCCESSFUL,
        comment: createdImage.toObject({ getters: true })
    });
}

export {
    getImagesByVenue,
    uploadImage
}