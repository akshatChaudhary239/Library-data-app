import { Response, NextFunction } from 'express';
import * as seatsService from './seats.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/authenticate';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await seatsService.getSeats((req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Seats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const generate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const { totalSeats } = req.body;
    const data = await seatsService.generateSeats((req.user!.libraryId as string), totalSeats);
    return sendSuccess(res, 201, data, 'Seats generated');
  } catch (error) {
    next(error);
  }
};

export const assign = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const { studentId } = req.body;
    const data = await seatsService.assignSeat(req.params.id, studentId, (req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Seat assigned successfully');
  } catch (error) {
    next(error);
  }
};

export const unassign = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await seatsService.unassignSeat(req.params.id, (req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Seat unassigned successfully');
  } catch (error) {
    next(error);
  }
};

export const reserve = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await seatsService.reserveSeat(req.params.id, (req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Seat reserved successfully');
  } catch (error) {
    next(error);
  }
};
