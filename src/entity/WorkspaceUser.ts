import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Workspace } from './Workspace';

@Entity({ name: "workspace_user" })
export class WorkspaceUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.workspaceUsers)
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaceUsers)
  workspace: Workspace;
}
