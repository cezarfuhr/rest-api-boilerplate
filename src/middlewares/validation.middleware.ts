import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger';

export const validate =
  (schema: ZodSchema, property: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        logger.warn({ errors }, 'Validation error');

        return res.status(400).json({
          error: 'Validation failed',
          details: errors,
        });
      }

      logger.error({ error }, 'Unexpected validation error');
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
