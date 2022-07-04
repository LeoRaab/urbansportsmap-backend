import { Request, Response, NextFunction } from "express";
import MESSAGES from "../constants/messages";
import HttpError from "../models/http-error";
import VenueImage, { IVenueImageDoc } from "../models/venue-image";
import ImagesRepository from "../repositories/images-repository";

const imagesRepository = new ImagesRepository();

const getImagesByVenue = async (req: Request, res: Response, next: NextFunction) => {
    const venueId = req.params.venueId;

    const { result: images, error } = await imagesRepository.readAll({condition: { venue: venueId }});

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

const getImagesByUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const { result: images, error } = await imagesRepository.readAll({ condition: {user: userId} });

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

const getImagesByVenueAndUser = async (req: Request, res: Response, next: NextFunction) => {
    const venueId = req.params.venueId;
    const userId = req.userId;

    const { result: images, error } = await imagesRepository.readAll({ condition: {venue: venueId, user: userId}});

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
    const venueId = req.params.venueId;
    const userId = req.userId;

    if (!req.files) {
        return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
    }

    if (!venueId || !userId) {
        return next(new HttpError(MESSAGES.MISSING_PARAMETERS, 500));
    }

    const images = req.files as Express.Multer.File[];

    const imageFilenames = images.map(image => image.filename);

    const { createdImages, error } = await imagesRepository.createImages(imageFilenames, venueId, userId);

    if (error) {
        return next(error);
    }

    if (!createdImages) {
        return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
    }

    res.status(201).json({
        message: MESSAGES.CREATE_SUCCESSFUL
    });
}

const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    const imageId = req.params.imageId;
    const userId = req.userId;

    if (!imageId || !userId) {
        return next(new HttpError(MESSAGES.DELETE_FAILED, 500));
    }

    const { isDeleted, error } = await imagesRepository.deleteImage(imageId);

    if (error) {
        return next(error);
    }

    if (!isDeleted) {
        return next(new HttpError(MESSAGES.DELETE_FAILED, 500));
    }

    res.json({
        message: MESSAGES.DELETE_SUCCESFUL
    });
}

export {
    getImagesByVenue,
    getImagesByUser,
    getImagesByVenueAndUser,
    uploadImage,
    deleteImage
}