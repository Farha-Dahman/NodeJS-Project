import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'notification' })
export class Notification {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    type: string;

  @Column()
    action: string;

  @Index('index_isRead')
  @Column({ type: 'boolean', default: false })
    isRead: boolean;

  @CreateDateColumn()
    timestamp: Date;

  @ManyToOne(() => User, (user) => user.sentNotifications)
    sender: User;

  @ManyToOne(() => User, (user) => user.receivedNotifications)
    receiver: User;
}
