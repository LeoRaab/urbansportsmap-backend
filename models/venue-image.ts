import * as mongoose from 'mongoose';
import {ICommentDoc} from './comment';

const Schema = mongoose.Schema;

export interface IVenueImageDoc extends mongoose.Document {
    filename: string,
    altText: string
}

const venueImageSchema = new Schema<IVenueImageDoc>({
    filename: { type: String, required: true},
    altText: { type: String, required: true}
}, { timestamps: true })

const VenueImage = mongoose.model<IVenueImageDoc>('Image', venueImageSchema);

export default VenueImage;