import * as mongoose from 'mongoose';
import {IVenueDoc} from './venue';
import {IUserDoc} from './user';

const Schema = mongoose.Schema;

export interface IComment extends mongoose.Document {
    comment: string;
    venue: IVenueDoc;
    author: IUserDoc;
}

const commentSchema = new Schema<IComment>({
    comment: { type: String, required: true},
    venue: { type: Schema.Types.ObjectId, required: true, ref: 'Venue' },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
}, {timestamps: true})

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;