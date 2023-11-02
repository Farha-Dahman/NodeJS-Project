import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { CardActivity } from './CardActivity';
import { List } from './List';
import { CardAttachment } from './CardAttachment';
import { BoardLabel } from './BoardLabel';

@Entity({ name: 'card' })
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  reminderDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @ManyToMany(() => User, (user) => user.cards)
  users: User[];

  @OneToMany(() => CardActivity, (cardActivities) => cardActivities.card)
  cardActivities: CardActivity[];

  @ManyToOne(() => List, (list) => list.cards)
  list: List;

  @OneToMany(() => CardAttachment, (cardAttachments) => cardAttachments.card)
  cardAttachments: CardAttachment[];

  @ManyToMany(() => BoardLabel, (label) => label.cards)
  @JoinTable({ name: 'card_label' })
  BoardLabels: BoardLabel[];
}
