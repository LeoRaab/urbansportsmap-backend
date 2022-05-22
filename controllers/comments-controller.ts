import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';
import Comment, { ICommentDoc } from '../models/comment';
import * as mongoose from 'mongoose';
import CommentsRepository from '../repositories/comments-repository';
import MESSAGES from '../constants/messages';

const commentsRepository = new CommentsRepository();

const getCommentsByVenueId = async (req: Request, res: Response, next: NextFunction) => {
    const venueId = req.params.venueId;

    const { comments, error } = await commentsRepository.readComments({ venue: venueId });

    if (error) {
        return next(error);
    }

    if (!comments) {
        return next(new HttpError(MESSAGES.NO_DATA_FOUND, 404));
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
        return next(new HttpError(MESSAGES.NO_DATA_FOUND, 404));
    }

    res.json({
        comments: comments.map((comment: ICommentDoc) => comment.toObject({ getters: true }))
    });

}

const createComment = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError(MESSAGES.INVALID_INPUT, 422));
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
        return next(new HttpError(MESSAGES.CREATE_FAILED, 500));
    }

    res.status(201).json({
        message: MESSAGES.CREATE_SUCCESSFUL,
        comment: createdComment.toObject({ getters: true })
    });
}

const updateComment = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError(MESSAGES.INVALID_INPUT, 422));
    }

    const commentId = req.params.commentId;
    const commentText = req.body.comment;

    const { result: updatedComment, error } = await commentsRepository.update(commentId, { comment: commentText });

    if (error) {
        return next(error);
    }

    if (!updatedComment) {
        return next(new HttpError(MESSAGES.UPDATE_FAILED, 500));
    }

    res.json({
        message: MESSAGES.UPDATE_SUCCESFUL,
        comment: updatedComment
    });
}

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;

    const { isDeleted, error } = await commentsRepository.deleteComment(commentId);

    if (error) {
        return next(error);
    }

    if (!isDeleted) {
        return next(new HttpError(MESSAGES.DELETE_FAILED, 500));
    }

    res.json({
        message: MESSAGES.DELETE_SUCCESFUL
    });
}

export {
    getCommentsByVenueId,
    getCommentsByUserId,
    createComment,
    updateComment,
    deleteComment
}