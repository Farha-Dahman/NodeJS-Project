import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Photo } from '../types/types';
import { BoardActivity } from './BoardActivity';
import { BoardUser } from './BoardUser';
import { Card } from './Card';
import { CardActivity } from './CardActivity';
import { Comment } from './Comment';
import { Notification } from './Notification';
import { WorkspaceUser } from './WorkspaceUser';

@Entity({ name: 'user' })
@Index('user_isConfirmed_idx', ['isConfirmed'], { where: 'isConfirmed = true' })
@Index('user_fullName_idx', ['fullName'])
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;

  @Column({ type: 'varchar', length: 1000, nullable: false })
    password: string;

  @Column({ type: 'boolean', default: false })
    isConfirmed: boolean;

  @Column({ type: 'varchar', length: 255 })
    fullName: string;

  @Column({ type: 'json', nullable: true })
    photo: Photo | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
    phone: string;

  @Column({ default: 'Unknown', type: 'varchar', length: 100, nullable: true })
    jobTitle: string;

  @Column({ default: null, type: 'varchar', nullable: true })
    codeSent: string | null;

  @Index('user_createdAt_idx', ['createdAt'])
  @Column({ type: 'timestamptz', default: new Date() })
    createdAt: Date;

  @Column({ type: 'timestamptz', default: new Date() })
    updatedAt: Date;

  @OneToMany(() => WorkspaceUser, (workspaceUsers) => workspaceUsers.user)
    workspaceUsers: WorkspaceUser[];

  @OneToMany(() => BoardUser, (boardUsers) => boardUsers.user)
    boardUsers: BoardUser[];

  @OneToMany(() => BoardActivity, (boardActivities) => boardActivities.user)
    boardActivities: BoardActivity[];

  @OneToMany(() => CardActivity, (cardActivities) => cardActivities.user)
    cardActivities: CardActivity[];

  @ManyToMany(() => Card, (card) => card.users)
  @JoinTable({ name: 'card_user' })
    cards: Card[];

  @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.sender)
    sentNotifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.receiver)
    receivedNotifications: Notification[];
}
