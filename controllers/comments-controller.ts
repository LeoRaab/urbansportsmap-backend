import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';
import HttpError from '../models/http-error';
import Comment from '../models/comment';
import User from '../models/user';
import * as mongoose from 'mongoose';
import Venue from '../models/venue';

const getCommentsByVenueId = async (req: Request, res: Response, next: NextFunction) => {
    const venueId = req.params.venueId;

    res.json({
        message: 'Get comments by venueId: ' + venueId
    });
}

const getCommentsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    let user;
    try {
        user = await User.findById(userId).populate('comments');
    } catch (e) {
        return next(new HttpError('Fetching comments failed, please try again later.', 500))
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id!', 404));
    }

    res.json({
        comments: user.toObject({getters: true}).comments
    });
}

const createComment = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { comment, venue, author } = req.body;

    const createdComment = new Comment({
        comment,
        venue,
        author
    });

    let user;
    try {
        user = await User.findById(author);
    } catch (e) {
        return next(new HttpError('Creating comment failed, please try again.', 500));
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id!', 404));
    }

    let providedVenue;
    try {
        providedVenue =  await Venue.findById(venue);
    } catch (e) {
        return next(new HttpError('Creating comment failed, please try again.', 500));
    }

    if (!providedVenue) {
        return next(new HttpError('Could not find venue for provided id!', 404));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        await createdComment.save();

        user.comments.push(createdComment);
        providedVenue.comments.push(createdComment);

        await user.save({session});
        await providedVenue.save({session});

        await session.commitTransaction();
    } catch (e) {
        return next(new HttpError('Creating comment failed, please try again.', 500));
    }

    res.status(201).json({
        comment: createdComment.toObject({getters: true})
    });
}

const updateComment = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    res.json({
        message: 'Comment has been updated.'
    });
}

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;

    let comment;
    try {
        comment = await Comment.findById(commentId).populate(['author', 'venue']);
    } catch (e) {
        return next(new HttpError('Something went wrong, could not delete comment.', 500));
    }

    if (!comment) {
        return next(new HttpError('Could not find comment for provided id!', 404));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        await comment.remove({session});

        comment.author.comments.pull(comment);
        comment.venue.comments.pull(comment);

        await comment.author.save({session});
        await comment.venue.save({session});

        await session.commitTransaction();
    } catch (e) {
        return next(new HttpError('Something went wrong, could not delete comment.', 500));
    }

    res.json({
        message: 'Comment has been deleted.'
    });
}

export {
    getCommentsByVenueId,
    getCommentsByUserId,
    createComment,
    updateComment,
    deleteComment
}