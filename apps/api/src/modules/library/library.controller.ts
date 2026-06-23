import { Request, Response, NextFunction } from 'express';
import * as libraryService from './library.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/authenticate';

export const setup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await libraryService.setupLibrary(req.user!.userId, req.body);
    return sendSuccess(res, 201, data, 'Library setup successfully');
  } catch (error) {
    next(error);
  }
};

export const get = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await libraryService.getLibrary(req.user!.userId);
    return sendSuccess(res, 200, data, 'Library retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await libraryService.updateLibrary(req.user!.userId, req.body);
    return sendSuccess(res, 200, data, 'Library updated successfully');
  } catch (error) {
    next(error);
  }
};

export const stats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await libraryService.getStats(req.user!.userId);
    return sendSuccess(res, 200, data, 'Library stats retrieved');
  } catch (error) {
    next(error);
  }
};
