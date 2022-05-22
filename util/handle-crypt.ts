import * as bcrypt from 'bcryptjs';
import HttpError from '../models/http-error';

export const hashString = async (stringToHash: string, salt: number = 12): Promise<string | null> => {
    try {
        return await bcrypt.hash(stringToHash, salt);
    } catch (e) {
        return null;
    }
}

export const compareHashStrings = async (stringA: string, stringB: string): Promise<{isEqual: boolean, error?: HttpError}> => {
    try {
        const isEqual = await bcrypt.compare(stringA, stringB);
        return {isEqual}
    } catch (e) {
        return {
            isEqual: false,
            error: new HttpError('Could not log you in, please check your credentials and try again.', 500)
        }
    }
} 