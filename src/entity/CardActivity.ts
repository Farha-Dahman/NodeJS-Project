import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './Card';
import { User } from './User';

@Entity({ name: 'card_activity' })
export class CardActivity {
  @PrimaryGeneratedColumn()
    id: number;

  @Index('index_card_action')
  @Column({ type: 'text' })
    action: string;

  @CreateDateColumn()
    timestamp: Date;

  @ManyToOne(() => User, (user) => user.cardActivities, { onDelete: 'CASCADE' })
    user: User;

  @ManyToOne(() => Card, (card) => card.cardActivities, { onDelete: 'CASCADE' })
    card: Card;
}
