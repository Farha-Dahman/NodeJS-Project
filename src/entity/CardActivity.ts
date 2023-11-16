import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Card } from './Card';

@Entity({ name: 'card_activity' })
export class CardActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  action: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.cardActivities)
  user: User;

  @ManyToOne(() => Card, (card) => card.cardActivities)
  card: Card;
}
