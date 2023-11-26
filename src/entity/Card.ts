import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardLabel } from './BoardLabel';
import { CardActivity } from './CardActivity';
import { CardAttachment } from './CardAttachment';
import { Comment } from './Comment';
import { List } from './List';
import { User } from './User';

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

  @OneToMany(() => CardActivity, (cardActivities) => cardActivities.card, {
    cascade: true,
    onDelete: 'CASCADE',
  })
    cardActivities: CardActivity[];

  @ManyToOne(() => List, (list) => list.cards, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    list: List;

  @OneToMany(() => CardAttachment, (cardAttachments) => cardAttachments.card, {
    cascade: true,
    onDelete: 'CASCADE',
  })
    cardAttachments: CardAttachment[];

  @ManyToMany(() => BoardLabel, (label) => label.cards, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'card_label' })
    BoardLabels: BoardLabel[];

  @OneToMany(() => Comment, (comments) => comments.card, { cascade: true, onDelete: 'CASCADE' })
    comments: Comment[];
}
