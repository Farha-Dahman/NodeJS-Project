import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import logger from '../../logger';
import { User } from '../entity/User';
import { Workspace } from '../entity/Workspace';
import { WorkspaceUser } from '../entity/WorkspaceUser';
import { NotificationService } from '../services/notification';

export const createWorkspace = async (req: Request, res: Response) => {
  const { name, type, description } = req.body;
  const workspaceRepository = getRepository(Workspace);
  const workspaceUserRepository = getRepository(WorkspaceUser);
  try {
    const { user } = req as any;
    if (!user) {
      logger.warn('User not found! Should make log in.');
      return res.status(401).json({ message: 'User not found! Please log in.' });
    }
    if (await workspaceRepository.findOne({ where: { name } })) {
      logger.info('Workspace name already exists.');
      return res.status(409).json({ message: 'Workspace name already exists!' });
    }
    const newWorkspace = workspaceRepository.create({
      name,
      type,
      description,
    });

    await workspaceRepository.save(newWorkspace);
    const workspaceUser = workspaceUserRepository.create({
      user: user,
      workspace: newWorkspace,
      isAdmin: true,
    });
    await workspaceUserRepository.save(workspaceUser);
    logger.info('Created workspace successfully');
    return res.status(201).json({ message: 'success', newWorkspace });
  } catch (error: any) {
    logger.error(`Error in create a workspace: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getSpecificWorkspace = async (req: Request, res: Response) => {
  const { id } = req.params;
  const workspaceRepository = getRepository(Workspace);
  const workspaceUserRepository = getRepository(WorkspaceUser);
  try {
    const numericId = parseInt(id, 10);
    const { user } = req as any;
    const isMember = await workspaceUserRepository.findOne({
      where: {
        userId: user.id,
        workspaceId: numericId,
      },
    });
    if (!isMember) {
      logger.info('Access denied! User is not a member of this workspace');
      return res.status(403).json({ message: 'Access denied! You not a member of this workspace' });
    }
    const workspace = await workspaceRepository.findOne({
      where: { id: numericId },
    });
    if (!workspace) {
      logger.info('Workspace not found');
      return res.status(404).json({ message: 'Workspace not found!' });
    }
    logger.info('Show a specific workspace successfully');
    return res.status(200).json({ message: 'success', workspace });
  } catch (error: any) {
    logger.error(`Error when get a specific Workspace: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllWorkspace = async (req: Request, res: Response) => {
  const workspaceUserRepository = getRepository(WorkspaceUser);
  try {
    const { user } = req as any;
    const userWorkspaceMembers = await workspaceUserRepository.find({
      where: {
        userId: user.id,
      },
    });

    if (userWorkspaceMembers.length === 0) {
      logger.info('No workspaces found for the user');
      return res.status(404).json({ message: 'No workspaces found for you' });
    }
    const workspaceIds = userWorkspaceMembers.map((member) => member.workspaceId);
    const workspaces = await workspaceUserRepository.manager
      .createQueryBuilder(WorkspaceUser, 'workspaceUser')
      .leftJoinAndSelect('workspaceUser.workspace', 'workspace')
      .where('workspaceUser.workspaceId IN (:...workspaceIds)', { workspaceIds })
      .getMany();

    logger.info('Successfully fetched user workspaces');
    return res.status(200).json({ message: 'success', workspaces });
  } catch (error: any) {
    logger.error(`Error when get all Workspace: ${error.message}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  const { id } = req.params;
  const workspaceRepository = getRepository(Workspace);
  const workspaceUserRepository = getRepository(WorkspaceUser);
  try {
    const numericId = parseInt(id, 10);
    const { user } = req as any;
    const workspace = await workspaceRepository.findOne({
      where: { id: numericId },
    });
    if (!workspace) {
      logger.info('Workspace not found');
      return res.status(404).json({ message: 'Workspace not found!' });
    }
    const isAdmin = await workspaceUserRepository.findOne({
      where: {
        userId: user.id,
        workspaceId: numericId,
        isAdmin: true,
      },
    });
    if (!isAdmin) {
      logger.info('User can not be deleted! User is not a member of this workspace');
      return res
        .status(403)
        .json({ message: 'Can not delete this workspace! You are not a member of this workspace' });
    }
    await workspaceRepository.remove(workspace);
    logger.info('Workspace deleted successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error when deleting workspace: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  const { id } = req.params;
  const workspaceRepository = getRepository(Workspace);
  const workspaceUserRepository = getRepository(WorkspaceUser);
  try {
    const numericId = parseInt(id, 10);
    const { user } = req as any;
    const workspace = await workspaceRepository.findOne({
      where: { id: numericId },
    });
    if (!workspace) {
      logger.info('Workspace not found');
      return res.status(404).json({ message: 'Workspace not found!' });
    }
    const isMember = await workspaceUserRepository.findOne({
      where: {
        userId: user.id,
        workspaceId: numericId,
      },
    });
    if (!isMember) {
      logger.info('User can not be updated! User is not a member of this workspace');
      return res
        .status(403)
        .json({ message: 'Can not update this workspace! You are not a member of this workspace' });
    }
    if (req.body.name !== undefined) {
      const existingWorkspace = await workspaceRepository
        .createQueryBuilder('workspace')
        .select('workspace.name')
        .where('workspace.name = :name', { name: req.body.name })
        .getOne();

      if (existingWorkspace) {
        return res.status(409).json({ message: 'This workspace already exists!' });
      }
      workspace.name = req.body.name;
    }
    if (req.body.type !== undefined) {
      workspace.type = req.body.type;
    }
    if (req.body.description !== undefined) {
      workspace.description = req.body.description;
    }
    await workspaceRepository.save(workspace);
    logger.info('Workspace updated successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error when updating workspace: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const addUserToWorkspace = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;
  const workspaceUserRepository = getRepository(WorkspaceUser);
  const workspaceRepository = getRepository(Workspace);
  const userRepository = getRepository(User);
  try {
    const numericId = parseInt(id, 10);
    const workspace = await workspaceRepository.findOne({
      where: { id: numericId },
    });
    if (!workspace) {
      logger.info('Workspace not found');
      return res.status(404).json({ message: 'Workspace not found!' });
    }

    const newUser = await userRepository.findOne({ where: { email } });
    if (!newUser) {
      logger.info('User not found');
      return res.status(404).json({ message: 'User not found!' });
    }

    const isMember = await workspaceUserRepository.findOne({
      where: {
        userId: newUser.id,
        workspaceId: numericId,
      },
    });
    if (isMember) {
      logger.info('User is already a member of this workspace');
      return res.status(409).json({ message: 'User is already a member of this workspace!' });
    }

    const workspaceUser = workspaceUserRepository.create({
      userId: newUser.id,
      workspaceId: numericId,
      isAdmin: false,
    });
    await workspaceUserRepository.save(workspaceUser);
    const { user } = req as any;
    const notificationService = new NotificationService();
    await notificationService.sendNotification(
      user.id,
      newUser.id,
      'Added',
      `You have been added to the workspace "${workspace.name}"`,
    );
    logger.info('User added to the workspace successfully');
    return res.status(201).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error adding user to workspace: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const removeUserFromWorkspace = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const workspaceUserRepository = getRepository(WorkspaceUser);
  const workspaceRepository = getRepository(Workspace);

  try {
    const numericWorkspaceId = parseInt(id, 10);
    const numericUserId = parseInt(userId, 10);
    const workspace = await workspaceRepository.findOne({
      where: { id: numericWorkspaceId },
    });

    if (!workspace) {
      logger.info('Workspace not found');
      return res.status(404).json({ message: 'Workspace not found!' });
    }

    const workspaceUser = await workspaceUserRepository.findOne({
      where: {
        userId: numericUserId,
        workspaceId: numericWorkspaceId,
      },
    });
    if (!workspaceUser) {
      logger.info('User is not a member of this workspace');
      return res.status(404).json({ message: 'User is not a member of this workspace!' });
    }
    await workspaceUserRepository.remove(workspaceUser);
    const { user } = req as any;
    const notificationService = new NotificationService();
    await notificationService.sendNotification(
      user.id,
      workspaceUser.userId,
      'Removed',
      `You have been removed from the workspace "${workspace.name}"`,
    );
    logger.info('User removed from the workspace successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error removing user from workspace: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllMembers = async (req: Request, res: Response) => {
  const { id } = req.params;
  const workspaceUserRepository = getRepository(WorkspaceUser);
  const workspaceRepository = getRepository(Workspace);
  try {
    const numericWorkspaceId = parseInt(id, 10);
    const workspace = await workspaceRepository.findOne({
      where: { id: numericWorkspaceId },
    });

    if (!workspace) {
      logger.info('Workspace not found');
      return res.status(404).json({ message: 'Workspace not found!' });
    }

    const workspaceUsers = await workspaceUserRepository.find({
      where: {
        workspaceId: numericWorkspaceId,
      },
      relations: ['user'],
    });

    const members = workspaceUsers.map((workspaceUser) => workspaceUser.user);
    logger.info('Successfully fetched members');
    return res.status(200).json({ message: 'success', members });
  } catch (error: any) {
    logger.error(`Error when get all members of workspace: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
