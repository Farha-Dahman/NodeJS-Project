import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARER_KEY!)) {
      return res.json({ message: 'invalid token' });
    }
    const token = authorization.split(process.env.BEARER_KEY!)[1];
    if (!token) {
      return res.json({ message: 'invalid token' });
    }
    const decoded = jwt.verify(token, process.env.LOGIN_SIGNATURE!) as JwtPayload;
    const userRepository = getRepository(User);

    const authUser = await userRepository.findOne({
      where: { id: decoded.id },
      select: ['fullName', 'email'],
    });
    if (!authUser) {
      return res.json({ message: 'Not register user' });
    }
    const user = authUser;
    (req as any).user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
