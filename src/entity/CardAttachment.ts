import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttachmentResponse } from '../models/types';
import { Card } from './Card';

@Entity({ name: 'card_attachment' })
export class CardAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Index('index_uploaded_date')
  @CreateDateColumn()
  uploadedDate: Date;

  @Column({ type: 'json', nullable: true })
  location: AttachmentResponse;

  @ManyToOne(() => Card, (card) => card.cardAttachments, { onDelete: 'CASCADE' })
  card: Card;
}
