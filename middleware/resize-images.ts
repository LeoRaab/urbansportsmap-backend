import { Request, Response, NextFunction } from "express";
import * as sharp from "sharp";
import * as uuid from "uuid"
import MESSAGES from "../constants/messages";
import HttpError from "../models/http-error";

const resizeImages = (req: Request, res: Response, next: NextFunction) => {

    if (!req.file) {
        return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
    }

    const path = 'uploads/images/venues/' + req.params.venueId + '/';
    const filename = uuid.v1();

    try {
        sharp(req.file.buffer)
            .resize(100, null, {
                kernel: sharp.kernel.nearest,
            })
            .toFile(path + filename + '.jpg')
            .then((info: sharp.OutputInfo) => {            
                req.file!.filename = filename + '.' + info.format;
                return next();
                // output.png is a 200 pixels wide and 300 pixels high image
                // containing a nearest-neighbour scaled version
                // contained within the north-east corner of a semi-transparent white canvas
            });
    } catch (e) {
        return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
    }
    
}

export default resizeImages;