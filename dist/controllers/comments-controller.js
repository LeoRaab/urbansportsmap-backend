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
exports.deleteComment = exports.updateComment = exports.createComment = exports.getCommentsByUserId = exports.getCommentsByVenueId = void 0;
const express_validator_1 = require("express-validator");
const http_error_1 = require("../models/http-error");
const comments_repository_1 = require("../repositories/comments-repository");
const messages_1 = require("../constants/messages");
const commentsRepository = new comments_repository_1.default();
const getCommentsByVenueId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const venueId = req.params.venueId;
    const { comments, error } = yield commentsRepository.readComments({ venue: venueId });
    if (error) {
        return next(error);
    }
    if (!comments) {
        return next(new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404));
    }
    res.json({
        comments: comments.map((comment) => comment.toObject({ getters: true }))
    });
});
exports.getCommentsByVenueId = getCommentsByVenueId;
const getCommentsByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { comments, error } = yield commentsRepository.readComments({ author: userId });
    if (error) {
        return next(error);
    }
    if (!comments) {
        return next(new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404));
    }
    res.json({
        comments: comments.map((comment) => comment.toObject({ getters: true }))
    });
});
exports.getCommentsByUserId = getCommentsByUserId;
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.default(messages_1.default.INVALID_INPUT, 422));
    }
    const { comment } = req.body;
    const userId = req.userId;
    const venueId = req.params.venueId;
    const { createdComment, error } = yield commentsRepository.createComment(comment, userId, venueId);
    if (error) {
        return next(error);
    }
    if (!createdComment) {
        return next(new http_error_1.default(messages_1.default.CREATE_FAILED, 500));
    }
    res.status(201).json({
        message: messages_1.default.CREATE_SUCCESSFUL,
        comment: createdComment.toObject({ getters: true })
    });
});
exports.createComment = createComment;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.default(messages_1.default.INVALID_INPUT, 422));
    }
    const commentId = req.params.commentId;
    const commentText = req.body.comment;
    const { result: updatedComment, error } = yield commentsRepository.update(commentId, { comment: commentText });
    if (error) {
        return next(error);
    }
    if (!updatedComment) {
        return next(new http_error_1.default(messages_1.default.UPDATE_FAILED, 500));
    }
    res.json({
        message: messages_1.default.UPDATE_SUCCESFUL,
        comment: updatedComment
    });
});
exports.updateComment = updateComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const { isDeleted, error } = yield commentsRepository.deleteComment(commentId);
    if (error) {
        return next(error);
    }
    if (!isDeleted) {
        return next(new http_error_1.default(messages_1.default.DELETE_FAILED, 500));
    }
    res.json({
        message: messages_1.default.DELETE_SUCCESFUL
    });
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=comments-controller.js.map