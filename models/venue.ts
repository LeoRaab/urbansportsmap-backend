import * as mongoose from 'mongoose';
import {IComment} from './comment';

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
    comments: mongoose.Types.Array<IComment>
}

const venueSchema = new Schema<IVenueDoc>({
    name: { type: String, required: true},
    location: {
        lat: { type: Number, required: true},
        lng: { type: Number, required: true}
    },
    sportTypes: [{ type: String, required: true}],
    comments: [{ type: Schema.Types.ObjectId, required: true, ref: 'Comment'}]
}, { timestamps: true })

const Venue = mongoose.model<IVenueDoc>('Venue', venueSchema);

export default Venue;