import { getRepository } from 'typeorm';
import { Notification } from '../entity/Notification';
import { User } from '../entity/User';

export class NotificationService {
  private notificationRepository = getRepository(Notification);

  async sendNotification(
    senderId: number,
    receiverId: number,
    type: string,
    action: string,
  ): Promise<Notification> {
    const sender = await this.getUserById(senderId);
    const receiver = await this.getUserById(receiverId);

    const notification = this.notificationRepository.create({
      type,
      action,
      sender,
      receiver,
    });

    return this.notificationRepository.save(notification);
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { receiver: { id: userId }, isRead: false },
      order: { timestamp: 'DESC' },
    });
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { receiver: { id: userId } },
      order: { timestamp: 'DESC' },
    });
  }

  private async getUserById(userId: number): Promise<User | undefined> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
    });
    return user || undefined;
  }
}
