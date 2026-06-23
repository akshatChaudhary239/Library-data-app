import { Response, NextFunction } from 'express';
import * as notesService from './notes.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/authenticate';

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await notesService.createNote((req.user!.libraryId as string), req.body);
    return sendSuccess(res, 201, data, 'Note created successfully');
  } catch (error) {
    next(error);
  }
};

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await notesService.getNotes((req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Notes retrieved');
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await notesService.updateNote(req.params.id, (req.user!.libraryId as string), req.body);
    return sendSuccess(res, 200, data, 'Note updated successfully');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    await notesService.deleteNote(req.params.id, (req.user!.libraryId as string));
    return sendSuccess(res, 200, null, 'Note deleted successfully');
  } catch (error) {
    next(error);
  }
};
