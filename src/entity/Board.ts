import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardActivity } from './BoardActivity';
import { BoardLabel } from './BoardLabel';
import { BoardUser } from './BoardUser';
import { List } from './List';
import { Workspace } from './Workspace';

@Entity({ name: 'board' })
export class Board {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ type: 'varchar', length: 150 })
    name: string;

  @Column({ type: 'boolean', default: false })
    isPublic: boolean;

  @Column({ type: 'boolean', default: false })
    isClosed: boolean;

  @CreateDateColumn()
    createdDate: Date;

  @OneToMany(() => BoardUser, (boardUsers) => boardUsers.board, { cascade: true, onDelete: 'CASCADE' })
    boardUsers: BoardUser[];

  @OneToMany(() => BoardActivity, (boardActivities) => boardActivities.board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
    boardActivities: BoardActivity[];

  @OneToMany(() => List, (list) => list.board, { cascade: true, onDelete: 'CASCADE' })
    lists: List[];

  @OneToMany(() => BoardLabel, (label) => label.board, { cascade: true, onDelete: 'CASCADE' })
    labels: BoardLabel[];

  @ManyToOne(() => Workspace, (workspace) => workspace.boards)
    workspace: Workspace;
}
