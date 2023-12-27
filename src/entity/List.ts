import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './Board';
import { Card } from './Card';

@Entity({ name: 'list' })
@Index('isArchived_list_index', ['isArchived'])
export class List {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'varchar', length: 100 })
    title: string;

  @Column('int')
    position: number;

  @Column({ type: 'boolean', default: false })
    isArchived: boolean;

  @ManyToOne(() => Board, (board) => board.lists)
    board: Board;

  @OneToMany(() => Card, (card) => card.list, { cascade: true, onDelete: 'CASCADE' })
    cards: Card[];
}
