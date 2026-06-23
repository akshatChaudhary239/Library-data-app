import { Response, NextFunction } from 'express';
import * as attendanceService from './attendance.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/authenticate';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const { attendance, meta } = await attendanceService.getAttendance((req.user!.libraryId as string), req.query);
    return sendSuccess(res, 200, attendance, undefined, meta);
  } catch (error) {
    next(error);
  }
};

export const checkIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const { studentId } = req.body;
    const data = await attendanceService.checkIn(studentId, (req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Checked in successfully');
  } catch (error) {
    next(error);
  }
};

export const checkOut = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const { studentId } = req.body;
    const data = await attendanceService.checkOut(studentId, (req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Checked out successfully');
  } catch (error) {
    next(error);
  }
};
