import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './Board';
import { User } from './User';

@Entity({ name: 'board_activity' })
@Index('board_activity_action_idx', ['action'])
export class BoardActivity {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'text' })
    action: string;

  @CreateDateColumn()
    timestamp: Date;

  @ManyToOne(() => User, (user) => user.boardActivities)
    user: User;

  @ManyToOne(() => Board, (board) => board.boardActivities)
    board: Board;
}
