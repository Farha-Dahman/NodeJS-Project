import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import logger from '../../logger';

export const validation = (schema: ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info('Validation middleware is running');
    const { error } = schema.validate(req.body);
    if (error) {
      logger.error('Validation error:', error);
      return res.status(400).json({ error: error.details });
    }
    next();
  };
};
