import { Response, NextFunction } from 'express';
import * as paymentsService from './payments.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../middleware/authenticate';

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await paymentsService.recordPayment((req.user!.libraryId as string), req.body);
    return sendSuccess(res, 201, data, 'Payment recorded successfully');
  } catch (error) {
    next(error);
  }
};

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const { payments, meta } = await paymentsService.getPayments((req.user!.libraryId as string), req.query);
    return sendSuccess(res, 200, payments, undefined, meta);
  } catch (error) {
    next(error);
  }
};

export const get = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await paymentsService.getPaymentById(req.params.id, (req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Payment retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await paymentsService.updatePayment(req.params.id, (req.user!.libraryId as string), req.body);
    return sendSuccess(res, 200, data, 'Payment updated successfully');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    await paymentsService.deletePayment(req.params.id, (req.user!.libraryId as string));
    return sendSuccess(res, 200, null, 'Payment deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const receipt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(req.user!.libraryId as string)) throw { statusCode: 400, code: 'LIBRARY_REQUIRED', message: 'Library setup is required' };
    const data = await paymentsService.getReceiptData(req.params.id, (req.user!.libraryId as string));
    return sendSuccess(res, 200, data, 'Receipt data retrieved');
  } catch (error) {
    next(error);
  }
};
