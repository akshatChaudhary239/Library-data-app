import { Response, NextFunction } from 'express';
import * as studentsService from './students.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/authenticate';

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required first' };
    const data = await studentsService.createStudent((req.user!.libraryId as string), req.body);
    return sendSuccess(res, 201, data, 'Student created successfully');
  } catch (error) {
    next(error);
  }
};

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required first' };
    const { students, meta } = await studentsService.getStudents((req.user!.libraryId as string), req.query);
    return sendSuccess(res, 200, students, undefined, meta);
  } catch (error) {
    next(error);
  }
};

export const get = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required first' };
    const data = await studentsService.getStudentById(req.params.id, (req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Student retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required first' };
    const data = await studentsService.updateStudent(req.params.id, (req.user!.libraryId as string), req.body);
    return sendSuccess(res, 200, data, 'Student updated successfully');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required first' };
    await studentsService.deleteStudent(req.params.id, (req.user!.libraryId as string));
    return sendSuccess(res, 200, null, 'Student deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const expiring = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required first' };
    const data = await studentsService.getExpiringStudents((req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Expiring students retrieved');
  } catch (error) {
    next(error);
  }
};

export const overdue = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required first' };
    const data = await studentsService.getOverdueStudents((req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Overdue students retrieved');
  } catch (error) {
    next(error);
  }
};
