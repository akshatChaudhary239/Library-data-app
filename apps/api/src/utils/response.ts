import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  meta?: any;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any[];
  };
}

export const sendSuccess = <T>(res: Response, statusCode: number, data: T, message?: string, meta?: any) => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number, code: string, message: string, details?: any[]) => {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
  return res.status(statusCode).json(response);
};
