import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import User, { IUser } from '../models/user';
import HttpError from '../models/http-error';
import UsersRepository from '../repositories/users-repository';
import { signToken } from '../util/handle-jwt';
import { compareHashStrings } from '../util/handle-crypt';

const usersRepository = new UsersRepository();

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { result, error } = await usersRepository.readById(req.params.userId, ['-password']);

    if (error) {
        return next(error);
    }

    if (!result) {
        return next(new HttpError('Could not find ressource for provided id!', 404));
    }

    res.json({
        user: result.toObject({ getters: true })
    });
}

const signup = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { email, password, name } = req.body;
    const newUser: IUser = { email, password, name };

    const { userId, error } = await usersRepository.createUser(newUser);

    if (error) {
        return next(error);
    }

    if (!userId) {
        return next(new HttpError('Signing up failed, please try again later!', 500));
    }

    const token = signToken(userId, email);

    if (!token) {
        return next(new HttpError('Signing up failed, please try again later!', 500));
    }

    res.status(201).json({
        userid: userId,
        token: token
    });
}

const login = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { email, password } = req.body;

    const { result: identifiedUser, error: readError } = await usersRepository.readOne({ email: email });

    if (readError) {
        return { error: readError }
    }

    if (!identifiedUser) {
        return {
            error: new HttpError('Invalid credentials, could not log you in.', 401)
        }
    }

    const {isEqual: isValidPassword, error } = await compareHashStrings(password, identifiedUser.password);

    if (error) {
        return next(error);
    }

    if (!isValidPassword) {
        return next(new HttpError('Invalid credentials, could not log you in.', 401))
    }

    const token = signToken(identifiedUser.id, identifiedUser.email);

    if (!token) {
        return next(new HttpError('Logging in failed, please try again later!', 500));
    }

    res.json({
        userId: identifiedUser.id,
        token: token
    });
}

const logout = async (req: Request, res: Response, next: NextFunction) => {

    res.json({
        message: 'User logged out.'
    });
}

export {
    getUserById,
    signup,
    login,
    logout
}