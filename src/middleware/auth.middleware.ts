import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import logger from '../../logger';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARER_KEY!)) {
      logger.warn('Invalid token');
      return res.status(401).json({ message: 'Invalid token' });
    }
    const token = authorization.split(process.env.BEARER_KEY!)[1];
    if (!token) {
      logger.warn('Invalid token');
      return res.status(401).json({ message: 'Invalid token' });
    }
    const decoded = jwt.verify(token, process.env.LOGIN_SIGNATURE!) as JwtPayload;
    const userRepository = getRepository(User);

    const authUser = await userRepository.findOne({
      where: { id: decoded.id },
      select: ['fullName', 'email'],
    });
    if (!authUser) {
      logger.warn('Not registered user');
      return res.status(401).json({ message: 'Not registered user' });
    }
    logger.info('User authenticated successfully');
    const user = authUser;
    (req as any).user = user;
    next();
  } catch (error) {
    logger.error(`Authentication failed: ${error}`);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
