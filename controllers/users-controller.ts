import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';
import User from '../models/user';
import HttpError from '../models/http-error';


const getUsers = async (req: Request, res: Response, next: NextFunction) => {

    let users;

    try {
        users = await User.find({}, '-password');
    } catch (e) {
        return next(new HttpError('Fetching users failed, please try again later.', 500))
    }

    res.json({
        users: users.map(user => user.toObject({getters: true}))
    });
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    let user;
    try {
        user = await User.findById(userId, '-password').populate('favorites');
    } catch (e) {
        console.log(e);
        return next(new HttpError('Fetching user failed, please try again later.', 500))
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id!', 404));
    }

    res.json({
        user: user.toObject({getters: true})
    });
}

const signup = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { email, password, name } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email})
    } catch (e) {
        return next(new HttpError('Signing up failed, please try again later!', 500))
    }

    if (existingUser) {
        return next(new HttpError('User already exists, please login instead.', 422))
    }

    const createdUser = new User({
        email,
        password,
        name,
        comments: [],
        favorites: []
    })

    try {
        await createdUser.save();
    } catch (e) {
        return next(new HttpError('Signing up failed, please try again later!', 500))
    }

    res.status(201).json({
        user: createdUser.toObject({ getters: true})
    });
}

const login = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { email, password } = req.body;

    let identifiedUser;

    try {
        identifiedUser = await User.findOne({email})
    } catch (e) {
        return next(new HttpError('Logging in failed, please try again later.', 500))
    }

    if (!identifiedUser || identifiedUser.password !== password) {
        return next(new HttpError('Invalid credentials, could not log you in.', 401))
    }

    res.json({
        message: 'Logged in!'
    });
}

const logout = async (req: Request, res: Response, next: NextFunction) => {

    res.json({
        message: 'User logged out.'
    });
}

export {
    getUsers,
    getUserById,
    signup,
    login,
    logout
}