import * as mongoose from 'mongoose';
import {ICommentDoc} from './comment';
import {IVenueDoc} from './venue';

const Schema = mongoose.Schema;

export interface IUser {
    email: string,
    password: string,
    name: string
}

export interface IUserDoc extends IUser, mongoose.Document {
    comments: mongoose.Types.Array<ICommentDoc>,
    favorites: mongoose.Types.Array<IVenueDoc>
}

const userSchema = new Schema<IUserDoc>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    name: {type: String, required: true},
    comments: [{type: Schema.Types.ObjectId, required: true, ref: 'Comment'}],
    favorites: [{type: Schema.Types.ObjectId, required: true, ref: 'Venue'}]
}, { timestamps: true })

const User = mongoose.model<IUserDoc>('User', userSchema);

export default User;