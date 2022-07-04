"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    comment: { type: String, required: true },
    venue: { type: Schema.Types.ObjectId, required: true, ref: 'Venue' },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });
const Comment = mongoose.model('Comment', commentSchema);
exports.default = Comment;
//# sourceMappingURL=comment.js.map