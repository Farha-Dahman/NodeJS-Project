import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendConfirmationEmail from '../services/sendEmail';
import logger from '../../logger';

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    const userRepository = getRepository(User);
    const existingUser = await userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      logger.info('Email already exists');
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND ?? '10'));
    const token = jwt.sign({ email }, process.env.EMAIL_TOKEN!, {
      expiresIn: '1h',
    });
    const link = `${process.env.BASE_URL}/auth/confirmEmail/${token}`;
    const html = `Click here to confirm your email <a href='${link}'>verify email</a>`;
    sendConfirmationEmail(email, 'Confirm Your Email', html);

    const newUser = userRepository.create({
      fullName,
      email,
      password: hashedPassword,
    });
    await userRepository.save(newUser);
    logger.info('User registered successfully');
    return res.status(200).json({ message: 'success', newUser });
  } catch (error: any) {
    logger.error(`Error in signup: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
    });
    if (!user) {
      logger.info('Invalid email or password');
      return res.status(404).json({ message: 'Invalid email or password' });
    }
    if (!user.isConfirmed) {
      logger.info('User has not confirmed their email');
      return res.status(403).json({ message: 'Plz confirm your email' });
    }
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      logger.info('Invalid email or password');
      return res.status(404).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.LOGIN_SIGNATURE!, {
      expiresIn: '10m',
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.LOGIN_SIGNATURE!, {
      expiresIn: 60 * 60 * 24 * 7,
    });
    logger.info('User logged in successfully');
    return res.status(200).json({ message: 'success', token, refreshToken });
  } catch (error: any) {
    logger.error(`Error in login: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const confirmEmail = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decode = jwt.verify(token, process.env.EMAIL_TOKEN!) as { email: string };
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { email: decode.email, isConfirmed: false },
    });

    if (!user) {
      logger.info('Email already verified');
      return res.status(404).json({ message: 'Your Email already is verified!' });
    } else {
      user.isConfirmed = true;
      await userRepository.save(user);
      logger.info('Email confirmed successfully');
      return res.status(200).json({ message: 'Your email is confirmed successfully!' });
    }
  } catch (error: any) {
    logger.error(`Error in confirmEmail: ${error}`);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};
