import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './Card';
import { User } from './User';

@Entity({ name: 'card_activity' })
@Index('card_activity_action_idx', ['action'])
export class CardActivity {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'text' })
    action: string;

  @CreateDateColumn()
    timestamp: Date;

  @ManyToOne(() => User, (user) => user.cardActivities, { onDelete: 'CASCADE' })
    user: User;

  @ManyToOne(() => Card, (card) => card.cardActivities, { onDelete: 'CASCADE' })
    card: Card;
}
