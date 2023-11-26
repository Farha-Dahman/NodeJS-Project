import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './Card';
import { User } from './User';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'text' })
    content: string;

  @CreateDateColumn()
    createdDate: Date;

  @ManyToOne(() => User, (user) => user.comments)
    user: User;

  @ManyToOne(() => Card, (card) => card.comments)
    card: Card;
}
