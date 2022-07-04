"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const venueImageSchema = new Schema({
    filename: { type: String, required: true },
    altText: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    venue: { type: Schema.Types.ObjectId, required: true, ref: 'Venue' },
}, { timestamps: true });
const VenueImage = mongoose.model('Image', venueImageSchema);
exports.default = VenueImage;
//# sourceMappingURL=venue-image.js.map