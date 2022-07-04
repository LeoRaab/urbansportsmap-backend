import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as uuid from 'uuid';

import User, { IUser } from '../models/user';
import HttpError from '../models/http-error';
import UsersRepository from '../repositories/users-repository';
import { signToken } from '../util/handle-jwt';
import { compareHashStrings } from '../util/handle-crypt';
import MESSAGES from '../constants/messages';
import sendMail from '../util/send-mail';

const usersRepository = new UsersRepository();

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { result, error } = await usersRepository.readById(req.params.userId, {projection: ['-password']});

    if (error) {
        return next(error);
    }

    if (!result) {
        return next(new HttpError(MESSAGES.NO_DATA_FOUND, 404));
    }

    res.json({
        user: result.toObject({ getters: true })
    });
}

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

    const isEmaiSent = await sendMail(email, verifyString);

    if (!isEmaiSent) {
        return next(new HttpError(MESSAGES.SIGNUP_FAILED, 500));
    }

    res.status(201).json({
        message: MESSAGES.SIGNUP_SUCCESSFUL
    });
}

const verify = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.params.verifyString) {
        return next(new HttpError(MESSAGES.MISSING_PARAMETERS, 404));
    }

    const verifyString = req.params.verifyString;

    const { result: user, error } = await usersRepository.readOne({ verifyString })

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
        message: MESSAGES.VERIFY_SUCCESSFUL
    });
}

const login = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError(MESSAGES.INVALID_INPUT, 422));
    }

    const { email, password } = req.body;

    const { result: identifiedUser, error: readError } = await usersRepository.readOne({ email: email });

    if (readError) {
        return { error: readError }
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
        return next(new HttpError(MESSAGES.INVALID_CREDENTIALS, 401))
    }

    const token = signToken(identifiedUser.id, identifiedUser.email);

    if (!token) {
        return next(new HttpError(MESSAGES.LOGIN_FAILED, 500));
    }

    res.json({
        message: MESSAGES.LOGIN_SUCCESSFUL,
        userId: identifiedUser.id,
        token: token
    });
}

export {
    getUserById,
    signup,
    verify,
    login
}