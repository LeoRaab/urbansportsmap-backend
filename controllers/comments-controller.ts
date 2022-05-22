import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';
import Comment, { ICommentDoc } from '../models/comment';
import * as mongoose from 'mongoose';
import CommentsRepository from '../repositories/comments-repository';

const commentsRepository = new CommentsRepository();

const getCommentsByVenueId = async (req: Request, res: Response, next: NextFunction) => {
    const venueId = req.params.venueId;

    const { comments, error } = await commentsRepository.readComments({ venue: venueId });

    if (error) {
        return next(error);
    }

    if (!comments) {
        return next(new HttpError('Could not find comments for provided venueId!', 404));
    }

    res.json({
        comments: comments.map((comment: ICommentDoc) => comment.toObject({ getters: true }))
    });
}

const getCommentsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const { comments, error } = await commentsRepository.readComments({ author: userId });

    if (error) {
        return next(error);
    }

    if (!comments) {
        return next(new HttpError('Could not find comments for provided userId!', 404));
    }

    res.json({
        comments: comments.map((comment: ICommentDoc) => comment.toObject({ getters: true }))
    });

}

const createComment = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { comment } = req.body;
    const userId = req.userId;
    const venueId = req.params.venueId;

    console.log(comment + ' | ' + userId + ' | ' + venueId);

    const { createdComment, error } = await commentsRepository.createComment(comment, userId, venueId);

    if (error) {
        return next(error);
    }

    if (!createdComment) {
        return next(new HttpError('Creating comment failed, please try again.', 500));
    }

    res.status(201).json({
        comment: createdComment.toObject({ getters: true })
    });
}

const updateComment = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const commentId = req.params.commentId;
    const commentText = req.body.comment;

    const { result: updatedComment, error } = await commentsRepository.update(commentId, { comment: commentText });

    if (error) {
        return next(error);
    }

    if (!updatedComment) {
        return next(new HttpError('Updating comment failed, please try again.', 500));
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

        await comment.remove({ session });

        comment.author.comments.pull(comment);
        comment.venue.comments.pull(comment);

        await comment.author.save({ session });
        await comment.venue.save({ session });

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