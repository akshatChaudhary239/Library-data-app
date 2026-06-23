import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.signup(req.body);
    return sendSuccess(res, 201, data, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.login(req.body);
    return sendSuccess(res, 200, data, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw { statusCode: 400, code: 'MISSING_TOKEN', message: 'Refresh token is required' };
    }
    const data = await authService.refresh(refreshToken);
    return sendSuccess(res, 200, data, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return sendSuccess(res, 200, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};
