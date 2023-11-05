import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Board } from './Board';

@Entity({ name: 'board_activity' })
export class BoardActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.boardActivities)
  user: User;

  @ManyToOne(() => Board, (board) => board.boardActivities)
  board: Board;
}
