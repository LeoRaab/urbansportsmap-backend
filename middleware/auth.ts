import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import HttpError from '../models/http-error';

interface IUserToken {
  userId: string;
  email: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next(new HttpError('Authentication failed', 401));
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError('Authentication failed!', 401));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY!) as IUserToken;
    req.userId = decodedToken.userId;
    return next();
  } catch (e) {
    return next(new HttpError('Authentication failed!', 401));
  }
};

export default auth;
