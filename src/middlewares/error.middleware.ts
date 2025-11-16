import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(
      {
        error: err.message,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method,
      },
      'Application error'
    );

    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  logger.error(
    {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    },
    'Unexpected error'
  );

  return res.status(500).json({
    error: 'Internal server error',
  });
};

export const notFound = (req: Request, res: Response) => {
  logger.warn({ path: req.path, method: req.method }, 'Route not found');
  res.status(404).json({ error: 'Route not found' });
};
