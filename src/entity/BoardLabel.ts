import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './Board';
import { Card } from './Card';

@Entity({ name: 'board_label' })
export class BoardLabel {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'varchar', length: 50 })
    title: string;

  @Column({ type: 'varchar', length: 10 })
    color: string;

  @ManyToOne(() => Board, (board) => board.labels)
    board: Board;

  @ManyToMany(() => Card, (card) => card.BoardLabels)
    cards: Card[];
}
