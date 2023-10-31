import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { BoardUser } from './BoardUser';
import { BoardActivity } from './BoardActivity';
import { List } from './List';
import { BoardLabel } from './BoardLabel';

@Entity({ name: 'board' })
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @OneToMany(() => BoardUser, (boardUsers) => boardUsers.board)
  boardUsers: BoardUser[];

  @OneToMany(() => BoardActivity, (boardActivities) => boardActivities.board)
  boardActivities: BoardActivity[];
  
  @OneToMany(() => List, (list) => list.board)
  lists: List[];

  @OneToMany(() => BoardLabel, (label) => label.board)
  labels: BoardLabel[];
}