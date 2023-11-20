import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Workspace } from '../entity/Workspace';
import { Board } from '../entity/Board';
import { BoardUser } from '../entity/BoardUser';
import logger from '../../logger';
import { User } from '../entity/User';
import { BoardActivity } from '../entity/BoardActivity';
import { NotificationService } from '../services/notification';

export const createBoard = async (req: Request, res: Response) => {
  const { name, WorkspaceName, isPublic } = req.body;
  try {
    const { user } = req as any;
    const workspaceRepository = getRepository(Workspace);
    const boardRepository = getRepository(Board);
    const boardUserRepository = getRepository(BoardUser);
    if (!user) {
      logger.warn('User not found! Should make log in.');
      return res.status(401).json({ message: 'User not found! Please log in.' });
    }

    const workspace = await workspaceRepository.findOne({
      where: { name: WorkspaceName },
    });
    if (!workspace) {
      logger.info('Workspace not found');
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (await boardRepository.findOne({ where: { name } })) {
      logger.info('Board name already exists.');
      return res.status(409).json({ message: 'Board name already exists!' });
    }

    const newBoard = boardRepository.create({
      name,
      createdDate: new Date(),
      workspace: workspace,
      isPublic,
    });

    await boardRepository.save(newBoard);
    const boardUser = boardUserRepository.create({
      userId: user.id,
      boardId: newBoard.id,
      isAdmin: true,
    });
    await boardUserRepository.save(boardUser);
    logger.info('Board created successfully');
    return res.status(201).json({ message: 'success', board: newBoard });
  } catch (error: any) {
    logger.error(`Error in create a board: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const closeBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const boardRepository = getRepository(Board);
  try {
    const numericId = parseInt(id, 10);
    const board = await boardRepository.findOne({
      where: { id: numericId },
    });
    
    if (!board) {
      logger.info('Board not found');
      return res.status(404).json({ message: 'Board not found!' });
    }
    
    board.isClosed = true;
    await boardRepository.save(board);
    const { user } = req as any;
    logActivity(user,`closed board #${numericId}`, board);
    logger.info('Board closed successfully');
    return res.status(200).json({ message: 'Board closed successfully' });
  } catch (error: any) {
    logger.error(`Error when closing board: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const reopenBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const boardRepository = getRepository(Board);
  try {
    const numericId = parseInt(id, 10);
    const board = await boardRepository.findOne({
      where: { id: numericId },
    });
    
    if (!board) {
      logger.info('Board not found');
      return res.status(404).json({ message: 'Board not found!' });
    }
    
    board.isClosed = false;
    await boardRepository.save(board);
    const { user } = req as any;
    logActivity(user,`re-opened board #${numericId}`, board);
    logger.info('Board opened successfully');
    return res.status(200).json({ message: 'Board opened successfully' });
  } catch (error: any) {
    logger.error(`Error when re-opening board: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllOpenBoards = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const numericId = parseInt(workspaceId, 10);
    const boardRepository = getRepository(Board);
    const workspaceRepository = getRepository(Workspace);

    const workspace = await workspaceRepository.findOne({
      where: { id: numericId },
    });
    if (!workspace) {
      logger.info('Workspace not found');
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const openBoards = await boardRepository.find({
      where: { workspace: { id: numericId }, isClosed: false },
    });

    logger.info('Successfully fetched open boards');
    return res.status(200).json({ message: 'success', boards: openBoards });
  } catch (error: any) {
    logger.error(`Error fetching open boards: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getSpecificBoard = async (req: Request, res: Response) => {
  const { id, workspaceId } = req.params;
  const boardRepository = getRepository(Board);
  const workspaceRepository = getRepository(Workspace);
  try {
    const numericId = parseInt(id, 10);
    const numericWorkspaceId = parseInt(workspaceId, 10);
    const workspace = await workspaceRepository.findOne({
      where: { id: numericWorkspaceId },
    });

    if (!workspace) {
      logger.info('Workspace not found');
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const board = await boardRepository.findOne({
      where: { id: numericId, workspace: { id: numericWorkspaceId } },
    });

    if (!board) {
      logger.info('Board not found in this workspace');
      return res.status(404).json({ message: 'Board not found in this workspace!' });
    }

    if (board.isClosed) {
      logger.info('Cannot get board because it is closed. The user should re-open the board.');
      return res.status(403).json({
        message: 'Cannot show board because it is closed. Please re-open and try again.',
        board: null,
      });
    }
    logger.info('Board retrieved successfully');
    return res.status(200).json({ message: 'success', board });
  } catch (error: any) {
    logger.error(`Error when get Specific Board: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const boardRepository = getRepository(Board);
  const boardUserRepository = getRepository(BoardUser);
  try {
    const numericId = parseInt(id, 10);
    const { user } = req as any;
    const board = await boardRepository.findOne({
      where: { id: numericId },
    });
    if (!board) {
      logger.info('Board not found');
      return res.status(404).json({ message: 'Board not found!' });
    }
    const isMember = await boardUserRepository.findOne({
      where: {
        userId: user.id,
        boardId: numericId,
      },
    });

    if (!isMember || !isMember.isAdmin) {
      logger.info('User does not have permission to delete the board');
      return res.status(403).json({ message: 'You do not have permission to delete this board!' });
    }
    await boardRepository.remove(board);
    logger.info(`Board with ID ${numericId} deleted successfully`);
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error when deleting Board: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const updateBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  const boardRepository = getRepository(Board);
  const boardUserRepository = getRepository(BoardUser);
  const workspaceRepository = getRepository(Workspace);
  try {
    const { user } = req as any;
    const board = await boardRepository.findOne({
      where: { id: numericId },
    });

    if (!board) {
      logger.info('Board not found');
      return res.status(404).json({ message: 'Board not found!' });
    }
    const isMember = await boardUserRepository.findOne({
      where: {
        userId: user.id,
        boardId: numericId,
      },
    });
    if (!isMember) {
      logger.info('User cannot be updated! User is not a member of this board');
      return res
        .status(403)
        .json({ message: 'Cannot update this board! You are not a member of this board' });
    }
    if (req.body.name) {
      board.name = req.body.name;
    }

    if (req.body.workspaceName) {
      const newWorkspace = await workspaceRepository.findOne({
        where: { name: req.body.workspaceName },
      });
      if (!newWorkspace) {
        logger.info('New workspace not found');
        return res.status(404).json({ message: 'New workspace not found!' });
      }
      board.workspace = newWorkspace;
    }

    if (req.body.isPublic) {
      board.isPublic = req.body.isPublic;
    }
    await boardRepository.save(board);
    logActivity(user,`update board #${numericId}`, board);
    logger.info('Board updated successfully');
    return res.status(200).json({ message: 'Board updated successfully', board });
  } catch (error: any) {
    console.error('Error updating board:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const addMemberToBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;
  const boardUserRepository = getRepository(BoardUser);
  const boardRepository = getRepository(Board);
  const userRepository = getRepository(User);
  try {
    const numericId = parseInt(id, 10);
    const board = await boardRepository.findOne({
      where: { id: numericId },
    });
    if (!board) {
      logger.info('Board not found');
      return res.status(404).json({ message: 'Board not found!' });
    }

    const newUser = await userRepository.findOne({ where: { email } });
    if (!newUser) {
      logger.info('User not found');
      return res.status(404).json({ message: 'User not found!' });
    }

    const isMember = await boardUserRepository.findOne({
      where: {
        userId: newUser.id,
        boardId: numericId,
      },
    });
    if (isMember) {
      logger.info('User is already a member of this board');
      return res.status(409).json({ message: 'User is already a member of this board!' });
    }

    const newMember = boardUserRepository.create({
      userId: newUser.id,
      boardId: numericId,
      isAdmin: false,
    });
    await boardUserRepository.save(newMember);
    const { user } = req as any;
    const notificationService = new NotificationService();
    await notificationService.sendNotification(
      user.id,
      newUser.id,
      'Added',
      `You have been added to the board "${board.name}"`,
    );
    logActivity(user,`added new member ${user.fullName}to the board #${numericId}`, board);
    logger.info('User added to the board successfully');
    return res.status(201).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error adding user to board: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const removeMemberFromBoard = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const boardUserRepository = getRepository(BoardUser);
  const boardRepository = getRepository(Board);
  try {
    const numericBoardId = parseInt(id, 10);
    const numericUserId = parseInt(userId, 10);
    const board = await boardRepository.findOne({
      where: { id: numericBoardId },
    });

    if (!board) {
      logger.info('Board not found');
      return res.status(404).json({ message: 'Board not found!' });
    }

    const member = await boardUserRepository.findOne({
      where: {
        userId: numericUserId,
        boardId: numericBoardId,
      },
    });
    if (!member) {
      logger.info('User is not a member of this board');
      return res.status(404).json({ message: 'User is not a member of this board!' });
    }
    await boardUserRepository.remove(member);
    const { user } = req as any;
    const notificationService = new NotificationService();
    await notificationService.sendNotification(
      user.id,
      member.userId,
      'Removed',
      `You have been removed from the board "${board.name}"`,
    );
    logActivity(user,`deleted #${userId} member from the board #${numericBoardId}`, board);
    logger.info('User removed from the board successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error removing user from board: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllMembers = async (req: Request, res: Response) => {
  const { id } = req.params;
  const boardUserRepository = getRepository(BoardUser);
  const boardRepository = getRepository(Board);
  try {
    const numericId = parseInt(id, 10);
    const board = await boardRepository.findOne({
      where: { id: numericId },
    });

    if (!board) {
      logger.info('Board not found');
      return res.status(404).json({ message: 'Board not found!' });
    }

    const boardMembers = await boardUserRepository.find({
      where: {
        boardId: numericId,
      },
      relations: ['user'],
    });

    const members = boardMembers.map((boardMember) => boardMember.user);
    logger.info('Successfully fetched members');
    return res.status(200).json({ message: 'success', members });
  } catch (error: any) {
    logger.error(`Error when get all members of board: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const logActivity = async (user: any, action: string, board: Board) => {
  try {
    const activityLogRepository = getRepository(BoardActivity);
    const newLog = activityLogRepository.create({
      user,
      action,
      timestamp: new Date(),
      board,
    });

    await activityLogRepository.save(newLog);
    logger.info('Activity logged successfully');
    console.log('Activity logged successfully');
  } catch (error: any) {
    logger.error('Error logging activity:', error);
  }
};

export const getActivities = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    const activityLogRepository = getRepository(BoardActivity);

    const activities = await activityLogRepository.find({
      where: { board: { id: numericId } },
    });

    logger.info('Fetching board activities successfully');
    return res.status(200).json({ message: 'success', activities });
  } catch (error: any) {
    logger.error('Error fetching board activities:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
