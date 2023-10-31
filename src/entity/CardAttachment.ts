import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Card } from './Card';

@Entity({ name: "card_attachment" })
export class CardAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @CreateDateColumn()
  uploadedDate: Date;

  @Column()
  location: string;

  @ManyToOne(() => Card, (card) => card.cardAttachments)
  card: Card

}
