import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Board } from './Board';

@Entity({ name: 'board_user' })
export class BoardUser {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  boardId: number;
  
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.boardUsers)
  user: User;

  @ManyToOne(() => Board, (board) => board.boardUsers)
  board: Board;
}
