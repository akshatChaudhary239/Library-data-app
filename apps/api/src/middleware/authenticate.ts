import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    libraryId?: string;
    email: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Access token is missing or invalid');
  }

  const token = authHeader.split(' ')[1] as string;

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded as AuthRequest['user'];
    next();
  } catch (error) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Access token is missing or invalid');
  }
};
