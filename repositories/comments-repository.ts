import * as mongoose from 'mongoose';
import { FilterQuery } from "mongoose";
import MESSAGES from '../constants/messages';
import Comment, { ICommentDoc } from "../models/comment";
import HttpError from "../models/http-error";
import BaseRepository from "./base-repository";
import UsersRepository from "./users-repository";
import VenuesRepository from "./venues-repository";

class CommentsRepository extends BaseRepository<ICommentDoc> {
    constructor() {
        super(Comment);
    }

    async createComment(commentText: string, userId: string, venueId: string): Promise<{ createdComment?: ICommentDoc, error?: HttpError }> {
        const createdComment = new Comment({
            comment: commentText,
            venue: venueId,
            author: userId
        });

        const usersRepository = new UsersRepository();
        const { result: user, error: userError } = await usersRepository.readById(userId);

        const venuesRepository = new VenuesRepository();
        const { result: venue, error: venueError } = await venuesRepository.readById(venueId);

        if (userError || venueError) {
            return { error: userError || venueError }
        }

        if (!user) {
            return { error: new HttpError(MESSAGES.CREATE_FAILED, 404) }
        }

        if (!venue) {
            return { error: new HttpError(MESSAGES.CREATE_FAILED, 404) }
        }

        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            await createdComment.save({ session });

            user.comments.push(createdComment);
            venue.comments.push(createdComment);

            await user.save({ session });
            await venue.save({ session });

            await session.commitTransaction();
        } catch (e) {
            return { error: new HttpError(MESSAGES.CREATE_FAILED, 500) };
        }

        return { createdComment }
    }

    async readComments(condition: FilterQuery<ICommentDoc>): Promise<{ comments?: ICommentDoc[], error?: HttpError }> {

        const { result: comments, error } = await this.readAllAndPopulate('author', condition, 'name');

        if (error) {
            return { error }
        }

        if (!comments) {
            return { error: new HttpError(MESSAGES.NO_DATA_FOUND, 404) }
        }

        return { comments }
    }

    async deleteComment(commentId: string): Promise<{ isDeleted?: boolean, error?: HttpError }> {

        const { result: comment, error } = await this.readByIdAndPopulate(commentId, ['author', 'venue'])

        if (error) {
            return { error }
        }

        if (!comment) {
            return { error: new HttpError(MESSAGES.DELETE_FAILED, 404) };
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
            return { error: new HttpError(MESSAGES.DELETE_FAILED, 500) };
        }

        return {
            isDeleted: true
        }
    }
}

export default CommentsRepository;