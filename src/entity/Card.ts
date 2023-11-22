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
import { Comment } from './Comment';

@Entity({ name: 'card' })
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  reminderDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @ManyToMany(() => User, (user) => user.cards, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  users: User[];

  @OneToMany(() => CardActivity, (cardActivities) => cardActivities.card, { cascade: true, onDelete: 'CASCADE' })
  cardActivities: CardActivity[];

  @ManyToOne(() => List, (list) => list.cards, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  list: List;

  @OneToMany(() => CardAttachment, (cardAttachments) => cardAttachments.card, { cascade: true, onDelete: 'CASCADE' })
  cardAttachments: CardAttachment[];

  @ManyToMany(() => BoardLabel, (label) => label.cards, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'card_label' })
  BoardLabels: BoardLabel[];

  @OneToMany(() => Comment, (comments) => comments.card, { cascade: true, onDelete: 'CASCADE' })
  comments: Comment[];
}
