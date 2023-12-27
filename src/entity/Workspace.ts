import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './Board';
import { User } from './User';
import { WorkspaceUser } from './WorkspaceUser';

@Entity({ name: 'workspace' })
export class Workspace {
  @PrimaryGeneratedColumn()
    id: number;

  @Index('index_name')  
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
