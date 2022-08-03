import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import MESSAGES from '../constants/messages';
import HttpError from '../models/http-error';

interface IUserToken {
  userId: string;
  email: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next(new HttpError(MESSAGES.USER_AUTH_FAILED, 401));
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError(MESSAGES.USER_AUTH_FAILED, 401));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY!) as IUserToken;
    req.userId = decodedToken.userId;
    return next();
  } catch (e) {
    return next(new HttpError(MESSAGES.USER_AUTH_FAILED, 401));
  }
};

export default auth;
