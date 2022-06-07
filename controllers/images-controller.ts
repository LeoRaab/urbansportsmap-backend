import { Request, Response, NextFunction } from "express";
import MESSAGES from "../constants/messages";
import HttpError from "../models/http-error";
import ImagesRepository from "../repositories/images-repository";

const imagesRepository = new ImagesRepository();

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    /*
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError(MESSAGES.INVALID_INPUT, 422));
    }
    */

    const { altText } = req.body;
    const venueId = req.params.venueId;

    if (!req.file) {
        return next(new HttpError(MESSAGES.CREATE_FAILED, 404));
    }

    const filename = req.file.filename;

    const { createdImage, error } = await imagesRepository.createImage(filename, altText, venueId);

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
    uploadImage
}