"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    verifyString: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, required: true, ref: 'Comment' }],
    favorites: [{ type: Schema.Types.ObjectId, required: true, ref: 'Venue' }],
    images: [{ type: Schema.Types.ObjectId, required: true, ref: 'Image' }]
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map