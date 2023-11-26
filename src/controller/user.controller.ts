import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import logger from '../../logger';
import { User } from '../entity/User';
import cloudinary from '../services/cloudinary';

export const profile = async (req: Request, res: Response) => {
  const { user } = req as any;
  return res.json(user);
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;
    const userRepository = getRepository(User);

    if (!user) {
      logger.warn('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.fullName) {
      user.fullName = req.body.fullName;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.phone) {
      user.phone = req.body.phone;
    }
    if (req.body.jobTitle) {
      user.jobTitle = req.body.jobTitle;
    }

    user.updatedAt = new Date();
    await userRepository.save(user);

    logger.info(`User profile updated successfully for user ${user.id}`);
    return res.status(200).json({ message: 'success', user });
  } catch (error: any) {
    logger.error('Error in updateProfile:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const profilePicture = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;
    const userRepository = getRepository(User);

    if (!req.file) {
      logger.info('Please provide a file');
      return res.status(404).json('Please provide a file!');
    }

    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: `${process.env.APP_NAME}/profile-pictures/${user.id}/profile`,
    });

    user.photo = {
      public_id: public_id,
      secure_url: secure_url,
    };

    await userRepository.save(user);
    logger.info(`User profile picture uploaded successfully for user ${user.id}`);
    return res.json({ message: 'success', user });
  } catch (error: any) {
    logger.error('Error in upload picture:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userRepository = getRepository(User);
    const { user } = req as any;
    if (!user) {
      logger.info('User not found');
      return res.status(404).json({ message: 'User not found!' });
    }
    const userPassword = await userRepository.findOne({
      where: { email: user.email },
      select: ['password'],
    });

    if (newPassword !== confirmNewPassword) {
      logger.info('New password and confirm password do not match');
      return res.status(400).json({ message: 'New password and confirm password do not match!' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, userPassword!.password);
    if (!isPasswordValid) {
      logger.info('Current password is incorrect');
      return res.status(401).json({ message: 'Current password is incorrect!' });
    }

    const hashedNewPassword = bcrypt.hashSync(
      newPassword,
      parseInt(process.env.SALT_ROUND || '10'),
    );

    user.password = hashedNewPassword;
    await userRepository.save(user);
    logger.info(`Password changed successfully for user ${user.id}`);
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    logger.error('Error in changePassword:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
