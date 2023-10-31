import {Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { Comment } from './Comment';
import { Notification } from './Notification';
import { Card } from "./Card";
import { BoardUser } from "./BoardUser";
import { WorkspaceUser } from "./WorkspaceUser";
import { BoardActivity } from "./BoardActivity";
import { CardActivity } from "./CardActivity";

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({unique: true})
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar',length: 1000, nullable: false})
  password: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 15000, nullable: true })
  photo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  jobTitle: string;

  @Column({ type: "timestamptz", default: "now()"})
  createdAt: Date;

  @Column({ type: "timestamptz" })
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

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Notification, notification => notification.sender)
  sentNotifications: Notification[];

  @OneToMany(() => Notification, notification => notification.receiver)
  receivedNotifications: Notification[];
}