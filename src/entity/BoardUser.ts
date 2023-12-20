import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Board } from './Board';
import { User } from './User';

@Entity({ name: 'board_user' })
export class BoardUser {
  @PrimaryColumn()
    userId: number;

  @PrimaryColumn()
    boardId: number;

  @Column({ type: 'boolean', default: false })
    isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.boardUsers, { cascade: true, onDelete: 'CASCADE' })
    user: User;

  @ManyToOne(() => Board, (board) => board.boardUsers, { onDelete: 'CASCADE' })
    board: Board;
}
