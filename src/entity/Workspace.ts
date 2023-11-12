import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';
import { WorkspaceUser } from './WorkspaceUser';
import { Board } from './Board';

@Entity({ name: 'workspace' })
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.workspaceUsers, { cascade: true, onDelete: 'CASCADE' })
  workspaceUsers: WorkspaceUser[];

  @OneToMany(() => Board, (board) => board.workspace)
  boards: Board[];
}
