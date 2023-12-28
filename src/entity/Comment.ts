import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './Card';
import { User } from './User';

@Entity({ name: 'comment' })
@Index('comment_createdDate_idx', ['createdDate'])
export class Comment {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'text' })
    content: string;

  @CreateDateColumn()
    createdDate: Date;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    user: User;

  @ManyToOne(() => Card, (card) => card.comments, { onDelete: 'CASCADE' })
    card: Card;
}
