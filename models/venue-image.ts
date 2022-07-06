import * as mongoose from 'mongoose';
import { IUserDoc } from './user';
import { IVenueDoc } from './venue';

const Schema = mongoose.Schema;

export interface IVenueImageDoc extends mongoose.Document {
  filename: string;
  altText: string;
  user: IUserDoc;
  venue: IVenueDoc;
}

const venueImageSchema = new Schema<IVenueImageDoc>(
  {
    filename: { type: String, required: true },
    altText: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    venue: { type: Schema.Types.ObjectId, required: true, ref: 'Venue' },
  },
  { timestamps: true },
);

const VenueImage = mongoose.model<IVenueImageDoc>('Image', venueImageSchema);

export default VenueImage;
