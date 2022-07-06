import * as jwt from 'jsonwebtoken';

export const signToken = (userId: string, email: string): string | null => {
  try {
    return jwt.sign({ userId, email }, process.env.JWT_KEY!, { expiresIn: '1h' });
  } catch (e) {
    return null;
  }
};
