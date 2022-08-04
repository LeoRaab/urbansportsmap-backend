import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as uuid from 'uuid';

import User, { IUser } from '../models/user';
import HttpError from '../models/http-error';
import UsersRepository from '../repositories/users-repository';
import { signToken } from '../util/handle-jwt';
import { compareHashStrings, hashString } from '../util/handle-crypt';
import MESSAGES from '../constants/messages';
import sendMail from '../util/send-mail';

const usersRepository = new UsersRepository();

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { result, error } = await usersRepository.readById(req.userId, { projection: ['-password'] });

  if (error) {
    return next(error);
  }

  if (!result) {
    return next(new HttpError(MESSAGES.NO_DATA_FOUND, 404));
  }

  res.json({
    user: result.toObject({ getters: true }),
  });
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(MESSAGES.INVALID_INPUT, 422));
  }

  const { email, password, name } = req.body;
  const verifyString = uuid.v4();

  const newUser: IUser = { email, password, name, isVerified: false, verifyString };

  const { userId, error } = await usersRepository.createUser(newUser);

  if (error) {
    return next(error);
  }

  if (!userId) {
    return next(new HttpError(MESSAGES.SIGNUP_FAILED, 500));
  }

  const subject = 'Email-Adresse bestätigen';
  const mailText = `Gehe bitte zu: ${process.env.FRONTEND_URL}/user/verify/${verifyString}, um deinen Account zu verifizieren.`;
  const mailHtml = `Klicke bitte <a href="${process.env.FRONTEND_URL}/user/verify/${verifyString}>hier</a> um deine Email-Adresse zu bestätigen. Danke!`;

  const isEmaiSent = await sendMail({email, subject, mailText, mailHtml});

  if (!isEmaiSent) {
    await usersRepository.delete(userId);
    return next(new HttpError(MESSAGES.SIGNUP_FAILED, 500));
  }

  res.status(201).json({
    message: MESSAGES.SIGNUP_SUCCESSFUL,
  });
};

const verify = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.verifyString) {
    return next(new HttpError(MESSAGES.MISSING_PARAMETERS, 404));
  }

  const verifyString = req.params.verifyString;

  const { result: user, error } = await usersRepository.readOne({ verifyString });

  if (error) {
    return next(error);
  }

  if (!user) {
    return next(new HttpError(MESSAGES.VERIFY_FAILED, 500));
  }

  user.isVerified = true;

  try {
    user.save();
  } catch (e) {
    return next(new HttpError(MESSAGES.VERIFY_FAILED, 500));
  }

  res.status(201).json({
    message: MESSAGES.VERIFY_SUCCESSFUL,
  });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(MESSAGES.INVALID_INPUT, 422));
  }

  const { email, password } = req.body;

  const { result: identifiedUser, error: readError } = await usersRepository.readOne({ email: email });

  if (readError) {
    return { error: readError };
  }

  if (!identifiedUser) {
    return next(new HttpError(MESSAGES.INVALID_CREDENTIALS, 401));
  }

  if (!identifiedUser.isVerified) {
    return next(new HttpError(MESSAGES.USER_NOT_VERIFIED, 401));
  }

  const { isEqual: isValidPassword, error } = await compareHashStrings(password, identifiedUser.password);

  if (error) {
    return next(error);
  }

  if (!isValidPassword) {
    return next(new HttpError(MESSAGES.INVALID_CREDENTIALS, 401));
  }

  const token = signToken(identifiedUser.id, identifiedUser.email);

  if (!token) {
    return next(new HttpError(MESSAGES.LOGIN_FAILED, 500));
  }

  res.json({
    message: MESSAGES.LOGIN_SUCCESSFUL,
    userId: identifiedUser.id,
    token: token,
  });
};

const requestPassword = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.email);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(MESSAGES.INVALID_INPUT, 422));
  }

  const email = req.body.email;
  const { result: user, error: userError } = await usersRepository.readOne({ email }, { projection: ['-password'] });

  if (userError) {
    return next(userError);
  }

  if (!user) {
    return next(new HttpError(MESSAGES.MISSING_PARAMETERS, 404));
  }

  const verifyString = uuid.v4();

  try {
    user.verifyString = verifyString;
    user.save();
  } catch (e) {
    return next(new HttpError(MESSAGES.RESET_PASSWORD_FAILED, 404));
  }

  const subject = 'Passwort zurücksetzen';
  const mailText = `Gehe bitte zu: ${process.env.FRONTEND_URL}/user/password/reset/${verifyString}, um dein Passwort zurückzusetzen.`;
  const mailHtml = `Klicke bitte <a href="${process.env.FRONTEND_URL}/user/password/reset/${verifyString}>hier</a> um dein Passwort zurückzusetzen. Danke!`;

  const isEmaiSent = await sendMail({ email: user.email, subject, mailText, mailHtml });

  if (!isEmaiSent) {
    return next(new HttpError(MESSAGES.RESET_PASSWORD_FAILED, 500));
  }

  res.status(201).json({
    message: MESSAGES.RESET_PASSWORD_SUCCESSFUL,
  });
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(MESSAGES.INVALID_INPUT, 422));
  }

  const verifyString = req.body.verifyString;
  const password = req.body.password;
  const hashedPassword = await hashString(password);

  if (!hashedPassword) {
    return { error: new HttpError(MESSAGES.RESET_PASSWORD_FAILED, 500) };
  }

  const { result: updatedUser, error } = await usersRepository.updateByQuery(
    { verifyString },
    { password: hashedPassword },
  );

  if (error) {
    return next(error);
  }

  if (!updatedUser) {
    return next(new HttpError(MESSAGES.UPDATE_FAILED, 500));
  }

  res.json({
    message: MESSAGES.UPDATE_SUCCESFUL,
  });
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;

  const { result, error } = await usersRepository.delete(userId);

  if (error) {
    return next(error);
  }

  if (!result) {
    return next(new HttpError(MESSAGES.DELETE_FAILED, 500));
  }

  res.json({
    message: MESSAGES.DELETE_SUCCESFUL,
  });
};

export { getUserById, signup, verify, login, resetPassword, requestPassword, deleteUser };
