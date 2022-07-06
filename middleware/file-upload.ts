import * as multer from 'multer';
import { Request } from 'express';
import * as uuid from 'uuid';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

interface IMIME_TYPE_MAP {
  'image/png': string;
  'image/jpeg': string;
  'image/jpg': string;
}

const MIME_TYPE_MAP: IMIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const fileUpload = multer({
  //limit uploads to 2 MB
  limits: {
    fileSize: 2097152,
  },
  storage: multer.memoryStorage(),
  fileFilter: (request: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype as keyof IMIME_TYPE_MAP];
    const error = isValid ? null : new Error();
    callback(null, isValid);
  },
});

export default fileUpload;
