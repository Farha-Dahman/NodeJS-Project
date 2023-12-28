import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'notification' })
@Index('notification_isRead_idx', ['isRead'], { where: 'isRead = true' })
export class Notification {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    type: string;

  @Column()
    action: string;

  @Column({ type: 'boolean', default: false })
    isRead: boolean;

  @CreateDateColumn()
    timestamp: Date;

  @ManyToOne(() => User, (user) => user.sentNotifications)
    sender: User;

  @ManyToOne(() => User, (user) => user.receivedNotifications)
    receiver: User;
}
