import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import logger from '../../logger';
import { Notification } from '../entity/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);
    const notifications = await getRepository(Notification).find({
      where: {
        receiver: {
          id: numericUserId,
        },
      },
    });
    logger.info('Successfully fetched notifications');
    return res.status(200).json({ message: 'success', notifications });
  } catch (error: any) {
    logger.error('Error fetching notifications:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const changeNotificationReadStatus = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const numericNotificationId = parseInt(notificationId, 10);
    const notification = await getRepository(Notification).findOne({
      where: { id: numericNotificationId },
    });

    if (!notification) {
      logger.info('Notification not found');
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = !notification.isRead;
    await getRepository(Notification).save(notification);

    logger.info(`Notification marked as ${notification.isRead ? 'read' : 'unread'} successfully`);
    return res.status(200).json({ message: 'success', isRead: notification.isRead });
  } catch (error: any) {
    logger.error('Error toggling notification read status:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
