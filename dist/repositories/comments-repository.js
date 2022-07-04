"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const messages_1 = require("../constants/messages");
const comment_1 = require("../models/comment");
const http_error_1 = require("../models/http-error");
const base_repository_1 = require("./base-repository");
const users_repository_1 = require("./users-repository");
const venues_repository_1 = require("./venues-repository");
class CommentsRepository extends base_repository_1.default {
    constructor() {
        super(comment_1.default);
    }
    createComment(commentText, userId, venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdComment = new comment_1.default({
                comment: commentText,
                venue: venueId,
                author: userId
            });
            const usersRepository = new users_repository_1.default();
            const { result: user, error: userError } = yield usersRepository.readById(userId);
            const venuesRepository = new venues_repository_1.default();
            const { result: venue, error: venueError } = yield venuesRepository.readById(venueId);
            if (userError || venueError) {
                return { error: userError || venueError };
            }
            if (!user) {
                return { error: new http_error_1.default(messages_1.default.CREATE_FAILED, 404) };
            }
            if (!venue) {
                return { error: new http_error_1.default(messages_1.default.CREATE_FAILED, 404) };
            }
            try {
                const session = yield mongoose.startSession();
                session.startTransaction();
                yield createdComment.save({ session });
                user.comments.push(createdComment);
                venue.comments.push(createdComment);
                yield user.save({ session });
                yield venue.save({ session });
                yield session.commitTransaction();
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.CREATE_FAILED, 500) };
            }
            return { createdComment };
        });
    }
    readComments(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const { result: comments, error } = yield this.readAllAndPopulate('author', { condition, selectField: 'name', sort: { updatedAt: -1 } });
            if (error) {
                return { error };
            }
            if (!comments) {
                return { error: new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404) };
            }
            return { comments };
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { result: comment, error } = yield this.readByIdAndPopulate(commentId, ['author', 'venue']);
            if (error) {
                return { error };
            }
            if (!comment) {
                return { error: new http_error_1.default(messages_1.default.DELETE_FAILED, 404) };
            }
            try {
                const session = yield mongoose.startSession();
                session.startTransaction();
                yield comment.remove({ session });
                comment.author.comments.pull(comment);
                comment.venue.comments.pull(comment);
                yield comment.author.save({ session });
                yield comment.venue.save({ session });
                yield session.commitTransaction();
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.DELETE_FAILED, 500) };
            }
            return {
                isDeleted: true
            };
        });
    }
}
exports.default = CommentsRepository;
//# sourceMappingURL=comments-repository.js.map