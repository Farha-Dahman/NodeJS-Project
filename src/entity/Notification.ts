import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
// import { Board } from './Board';

@Entity({ name: 'notification'})
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

  @ManyToOne(() => User, user => user.sentNotifications)
  sender: User;

  @ManyToOne(() => User, user => user.receivedNotifications)
  receiver: User;

}
