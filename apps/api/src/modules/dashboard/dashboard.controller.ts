import { Response, NextFunction } from 'express';
import * as dashboardService from './dashboard.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/authenticate';

export const getMetrics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await dashboardService.getDashboardData((req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Dashboard metrics retrieved');
  } catch (error) {
    next(error);
  }
};
