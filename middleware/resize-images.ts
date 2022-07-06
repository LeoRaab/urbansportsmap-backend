import { Request, Response, NextFunction } from 'express';
import * as sharp from 'sharp';
import * as uuid from 'uuid';
import MESSAGES from '../constants/messages';
import HttpError from '../models/http-error';

const resizeImages = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) {
    return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
  }

  const path = 'uploads/images/venues/' + req.params.venueId + '/';
  const images = req.files as Express.Multer.File[];

  for (const image of images) {
    const filename = uuid.v1() + '.jpeg';

    try {
      await sharp(image.buffer)
        .resize(1024, 768, {
          kernel: sharp.kernel.nearest,
          fit: 'cover',
        })
        .toFile(path + filename);

      image.filename = filename;
    } catch (e) {
      return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
    }
  }

  return next();
};

export default resizeImages;
