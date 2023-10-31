import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Board } from './Board';
import { Card } from './Card';

@Entity({ name: 'list'})
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column('int')
  position: number;

  @ManyToOne(() => Board, (board) => board.lists)
  board: Board

  @OneToMany(() => Card, (card) => card.list)
  cards: Card[];
}