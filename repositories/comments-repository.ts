import * as mongoose from 'mongoose';
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
            return { error: new HttpError('Could not find user for provided id!', 404) }
        }

        if (!venue) {
            return { error: new HttpError('Could not find venue for provided id!', 404) }
        }

        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            
            console.log(createdComment);

            await createdComment.save();

            user.comments.push(createdComment);
            venue.comments.push(createdComment);

            await user.save({ session });
            await venue.save({ session });

            await session.commitTransaction();
        } catch (e) {
            return { error: new HttpError('Creating comment failed, please try again.', 500) };
        }

        return { createdComment }
    }

    async readComments(condition: object): Promise<{ comments?: ICommentDoc[], error?: HttpError }> {

        const { result: comments, error } = await this.readAllAndPopulate(condition, 'author', 'name');

        if (error) {
            return { error }
        }

        if (!comments) {
            return { error: new HttpError('Could not find comments for provided userId!', 404) }
        }

        return { comments }
    }
}

export default CommentsRepository;