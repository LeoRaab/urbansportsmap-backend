import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import MESSAGES from '../constants/messages';
import HttpError from '../models/http-error';

const checkUploadPath = (req: Request, res: Response, next: NextFunction) => {
  const venueId = req.params.venueId;

  if (!venueId) {
    next(new HttpError(MESSAGES.CREATE_FAILED, 404));
  }

  const uploadPath = 'uploads/images/venues/' + venueId;

  const isUploadPathExisting = fs.existsSync(uploadPath);

  if (!isUploadPathExisting) {
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
    } catch (e) {
      console.error(e);
      next(new HttpError(MESSAGES.CREATE_FAILED, 500));
    }
  }

  next();
};

export default checkUploadPath;
