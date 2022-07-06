import MESSAGES from '../constants/messages';
import HttpError from '../models/http-error';
import User, { IUser, IUserDoc } from '../models/user';
import { hashString } from '../util/handle-crypt';
import BaseRepository from './base-repository';

class UsersRepository extends BaseRepository<IUserDoc> {
  constructor() {
    super(User);
  }

  async createUser(user: IUser): Promise<{ userId?: string | null; error?: HttpError }> {
    const { result: existingUser, error: readError } = await this.readOne({
      $or: [{ email: user.email }, { name: user.name }],
    });

    if (readError) {
      return { error: readError };
    }

    if (existingUser) {
      return { error: new HttpError(MESSAGES.USER_EXISTS, 422) };
    }

    const hashedPassword = await hashString(user.password);

    if (!hashedPassword) {
      return { error: new HttpError(MESSAGES.SIGNUP_FAILED, 500) };
    }

    const newUser = {
      email: user.email,
      password: hashedPassword,
      name: user.name,
      isVerified: user.isVerified,
      verifyString: user.verifyString,
      comments: [],
      favorites: [],
    };

    const { item: createdUser, error: creationError } = await this.create(newUser);

    if (creationError) {
      return { error: creationError };
    }

    if (!createdUser) {
      return { error: new HttpError(MESSAGES.SIGNUP_FAILED, 500) };
    }

    return { userId: createdUser.id };
  }
}

export default UsersRepository;
