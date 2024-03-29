import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttachmentResponse } from '../types/types';
import { Card } from './Card';

@Entity({ name: 'card_attachment' })
@Index('card_attachment_uploadedDate_idx', ['uploadedDate'])
export class CardAttachment {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'varchar', length: 500 })
    name: string;

  @CreateDateColumn()
    uploadedDate: Date;

  @Column({ type: 'json', nullable: true })
    location: AttachmentResponse;

  @ManyToOne(() => Card, (card) => card.cardAttachments, { onDelete: 'CASCADE' })
    card: Card;
}
