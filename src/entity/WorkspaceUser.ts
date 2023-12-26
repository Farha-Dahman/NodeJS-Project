import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { Workspace } from './Workspace';

@Entity({ name: 'workspace_user' })
export class WorkspaceUser {
  @PrimaryColumn()
    userId: number;

  @PrimaryColumn()
    workspaceId: number;

  @Column({ type: 'boolean', default: false })
    isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.workspaceUsers, { onDelete: 'CASCADE' })
    user: User;
  
  @ManyToOne(() => Workspace, (workspace) => workspace.workspaceUsers, { onDelete: 'CASCADE' })
    workspace: Workspace;
}
