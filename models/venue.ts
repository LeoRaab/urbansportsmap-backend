import * as mongoose from 'mongoose';
import { ICommentDoc } from './comment';
import { IVenueImageDoc } from './venue-image';

const Schema = mongoose.Schema;

export interface IVenue {
    name: string,
    location: {
        lat: number,
        lng: number
    }
    sportTypes: string[]
}

export interface IVenueDoc extends IVenue, mongoose.Document {
    comments: mongoose.Types.Array<ICommentDoc>,
    images: mongoose.Types.Array<IVenueImageDoc>,
}

const venueSchema = new Schema<IVenueDoc>({
    name: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    sportTypes: [{ type: String, required: true }],
    comments: [{ type: Schema.Types.ObjectId, required: true, ref: 'Comment' }],
    images: [{ type: Schema.Types.ObjectId, required: true, ref: 'Image' }],
}, { timestamps: true })

const Venue = mongoose.model<IVenueDoc>('Venue', venueSchema);

export default Venue;