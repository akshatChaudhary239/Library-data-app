import { Response, NextFunction } from 'express';
import * as notificationsService from './notifications.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/authenticate';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await notificationsService.getNotifications((req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Notifications retrieved');
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await notificationsService.markAsRead(req.params.id, (req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    await notificationsService.markAllAsRead((req.user!.libraryId as string));
    return sendSuccess(res, 200, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
