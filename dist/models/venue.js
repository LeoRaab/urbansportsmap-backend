"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const venueSchema = new Schema({
    name: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    sportTypes: [{ type: String, required: true }],
    comments: [{ type: Schema.Types.ObjectId, required: true, ref: 'Comment' }],
    images: [{ type: Schema.Types.ObjectId, required: true, ref: 'Image' }],
}, { timestamps: true });
const Venue = mongoose.model('Venue', venueSchema);
exports.default = Venue;
//# sourceMappingURL=venue.js.map