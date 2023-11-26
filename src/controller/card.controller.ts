import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import logger from '../../logger';
import { BoardUser } from '../entity/BoardUser';
import { Card } from '../entity/Card';
import { CardActivity } from '../entity/CardActivity';
import { Comment } from '../entity/Comment';
import { List } from '../entity/List';
import { User } from '../entity/User';
import { NotificationService } from '../services/notification';

export const createCard = async (req: Request, res: Response) => {
  const { listId } = req.params;
  const cardRepository = getRepository(Card);
  const listRepository = getRepository(List);
  try {
    const { title, description, dueDate, reminderDate } = req.body;
    const numericId = parseInt(listId, 10);
    const { user } = req as any;
    if (!user) {
      logger.warn('User not found! Should make log in.');
      return res.status(401).json({ message: 'User not found! Please log in.' });
    }
    const list = await listRepository.findOne({
      where: { id: numericId },
    });

    if (!list) {
      logger.info('List not found');
      return res.status(404).json({ message: 'List not found!' });
    }
    const newCard = cardRepository.create({
      title,
      description,
      dueDate,
      reminderDate,
      createdDate: new Date(),
      isArchived: false,
      users: [user],
      list,
    });

    await cardRepository.save(newCard);
    logger.info('Card created successfully');
    return res.status(201).json({ message: 'success', card: newCard });
  } catch (error: any) {
    console.error('Error when creating card:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  const { id, boardId } = req.params;
  const numericId = parseInt(id, 10);
  const numericBoardId = parseInt(boardId, 10);
  const cardRepository = getRepository(Card);
  const boardUserRepository = getRepository(BoardUser);
  try {
    const { user } = req as any;
    const card = await cardRepository.findOne({
      where: { id: numericId },
    });

    if (!card) {
      logger.info('Card not found');
      return res.status(404).json({ message: 'Card not found!' });
    }
    const isMember = await boardUserRepository.findOne({
      where: {
        userId: user.id,
        boardId: numericBoardId,
      },
    });
    if (!isMember) {
      logger.info('User cannot be updated! User is not a member of this board');
      return res
        .status(403)
        .json({ message: 'Cannot update this card! You are not a member of this board' });
    }

    if (req.body.title) {
      card.title = req.body.title;
    }
    if (req.body.description) {
      card.description = req.body.description;
    }
    if (req.body.dueDate) {
      card.dueDate = req.body.dueDate;
    }
    if (req.body.reminderDate) {
      card.reminderDate = req.body.reminderDate;
    }

    await cardRepository.save(card);
    logger.info('Card updated successfully');
    logActivity(user, `update card #${numericId}`, card);
    return res.status(200).json({ message: 'success', card });
  } catch (error: any) {
    console.error('Error updating card:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

const archiveState = async (req: Request, res: Response, isArchived: boolean) => {
  const { id } = req.params;
  const cardRepository = getRepository(Card);
  try {
    const numericId = parseInt(id, 10);
    const card = await cardRepository.findOne({
      where: { id: numericId },
    });

    if (!card) {
      logger.info('Card not found');
      return res.status(404).json({ message: 'Card not found!' });
    }

    card.isArchived = isArchived;
    await cardRepository.save(card);

    const action = isArchived ? 'archived' : 'unarchived';
    const { user } = req as any;
    logActivity(user, `${action} card #${id}`, card);
    logger.info(`Card ${action} successfully`);
    return res.status(200).json({ message: 'success', card });
  } catch (error: any) {
    const action = isArchived ? 'archiving' : 'unarchiving';
    logger.error(`Error in ${action} card endpoint: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const archiveCard = async (req: Request, res: Response) => {
  await archiveState(req, res, true);
};

export const unarchiveCard = async (req: Request, res: Response) => {
  await archiveState(req, res, false);
};

export const deleteCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cardRepository = getRepository(Card);
  const boardUserRepository = getRepository(BoardUser);
  try {
    const numericId = parseInt(id, 10);
    const { user } = req as any;
    const card = await cardRepository.findOne({
      where: { id: numericId },
      relations: ['list', 'list.board'],
    });

    if (!card) {
      logger.info('Card not found');
      return res.status(404).json({ message: 'Card not found!' });
    }
    const isMember = await boardUserRepository.findOne({
      where: {
        userId: user.id,
        boardId: card.list.board.id,
      },
    });
    if (!isMember) {
      logger.info('User does not have permission to delete the card');
      return res.status(403).json({ message: 'You do not have permission to delete this card!' });
    }

    await cardRepository.remove(card);
    logger.info('Card deleted successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error when deleting card: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllCard = async (req: Request, res: Response) => {
  const { listId } = req.params;
  const numericId = parseInt(listId, 10);
  const listRepository = getRepository(List);
  const cardRepository = getRepository(Card);
  const boardUserRepository = getRepository(BoardUser);
  try {
    const { user } = req as any;
    const list = await listRepository.findOne({
      where: { id: numericId },
      relations: ['board'],
    });
    if (!list) {
      logger.info('List not found');
      return res.status(404).json({ message: 'List not found' });
    }
    const isMember = await boardUserRepository.findOne({
      where: {
        userId: user.id,
        boardId: list.board.id,
      },
    });
    if (!isMember) {
      logger.info('User does not have permission to show cards');
      return res.status(403).json({ message: 'You do not have permission to show cards!' });
    }

    const cards = await cardRepository.find({
      where: { list: { id: numericId }, isArchived: false },
    });
    logger.info('Successfully fetched all cards');
    return res.status(200).json({ message: 'success', cards: cards });
  } catch (error: any) {
    logger.error(`Error fetching all cards: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const addMemberToCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;
  const cardRepository = getRepository(Card);
  const userRepository = getRepository(User);
  try {
    const numericId = parseInt(id, 10);
    const { user } = req as any;
    const card = await cardRepository.findOne({
      where: { id: numericId },
      relations: ['users'],
    });

    if (!card) {
      logger.info('Card not found');
      return res.status(404).json({ message: 'Card not found!' });
    }

    const newUser = await userRepository.findOne({ where: { email } });
    if (!newUser) {
      logger.info('User not found');
      return res.status(404).json({ message: 'User not found!' });
    }

    const isMember = card.users.some((existingUser) => existingUser.id === newUser.id);
    if (isMember) {
      logger.info('User is already a member of this card');
      return res.status(409).json({ message: 'User is already a member of this card!' });
    }

    card.users.push(newUser);
    await cardRepository.save(card);
    const notificationService = new NotificationService();
    await notificationService.sendNotification(
      user.id,
      newUser.id,
      'Added',
      `You have been added to the card "${card.title}"`,
    );
    logger.info('User added to the card successfully');
    logActivity(user, `add ${user.fullName}to card`, card);
    return res.status(201).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error adding user to card: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteMemberFromCard = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const cardRepository = getRepository(Card);
  try {
    const numericCardId = parseInt(id, 10);
    const numericUserId = parseInt(userId, 10);
    const card = await cardRepository.findOne({
      where: { id: numericCardId },
      relations: ['users'],
    });

    if (!card) {
      logger.info('Card not found');
      return res.status(404).json({ message: 'Card not found!' });
    }

    const userToRemove = card.users.find((user) => user.id === numericUserId);
    if (!userToRemove) {
      logger.info('User not found in the card');
      return res.status(404).json({ message: 'User not found in the card!' });
    }
    card.users = card.users.filter((user) => user.id !== numericUserId);
    await cardRepository.save(card);
    const { user } = req as any;
    const notificationService = new NotificationService();
    await notificationService.sendNotification(
      user.id,
      userToRemove.id,
      'Removed',
      `You have been removed from the card "${card.title}"`,
    );
    logActivity(userToRemove, `delete member #${id} from card`, card);
    logger.info('User removed from the card successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error removing user from card: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllMembersForCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cardRepository = getRepository(Card);
  try {
    const numericId = parseInt(id, 10);
    const cards = await cardRepository.findOne({
      where: { id: numericId },
      relations: ['users'],
    });

    if (!cards) {
      logger.info('Card not found');
      return res.status(404).json({ message: 'Card not found!' });
    }

    const members = cards.users;
    logger.info('Fetching members for card successfully');
    return res.status(200).json({ message: 'success', members });
  } catch (error: any) {
    logger.error(`Error fetching members for card: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const logActivity = async (user: any, action: string, card: Card) => {
  try {
    const activityLogRepository = getRepository(CardActivity);
    const newLog = activityLogRepository.create({
      user,
      action,
      timestamp: new Date(),
      card,
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
    const activityLogRepository = getRepository(CardActivity);

    const activities = await activityLogRepository.find({
      where: { card: { id: numericId } },
    });

    logger.info('Fetching card activities successfully');
    return res.status(200).json({ message: 'success', activities });
  } catch (error: any) {
    logger.error('Error fetching card activities:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { content } = req.body;
  const { user } = req as any;
  const commentRepository = getRepository(Comment);
  const cardRepository = getRepository(Card);
  try {
    const numericCardId = parseInt(cardId, 10);
    const card = await cardRepository.findOne({ where: { id: numericCardId } });
    if (!card) {
      logger.info('Card not found');
      return res.status(404).json({ message: 'Card not found!' });
    }

    const newComment = commentRepository.create({
      content,
      user,
      card,
    });

    await commentRepository.save(newComment);
    logger.info('adding comment successfully');
    return res.status(201).json({ message: 'success', comment: newComment });
  } catch (error: any) {
    logger.error('Error adding comment:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const commentRepository = getRepository(Comment);
  try {
    const numericCommentId = parseInt(id, 10);
    const comment = await commentRepository.findOne({ where: { id: numericCommentId } });
    if (!comment) {
      logger.info('Comment not found');
      return res.status(404).json({ message: 'Comment not found!' });
    }

    await commentRepository.remove(comment);
    logger.info('Comment deleted successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error('Error deleting comment:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const editComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const commentRepository = getRepository(Comment);
  try {
    const numericCommentId = parseInt(id, 10);
    const comment = await commentRepository.findOne({ where: { id: numericCommentId } });

    if (!comment) {
      logger.info('Comment not found');
      return res.status(404).json({ message: 'Comment not found!' });
    }

    comment.content = content;
    await commentRepository.save(comment);
    logger.info('Comment updated successfully');
    return res.status(200).json({ message: 'success', comment });
  } catch (error: any) {
    logger.error('Error updating comment:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllComments = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const commentRepository = getRepository(Comment);
  try {
    const numericCardId = parseInt(cardId, 10);
    const comments = await commentRepository.find({ where: { card: { id: numericCardId } } });

    logger.info('fetching comments successfully');
    return res.status(200).json({ message: 'success', comments });
  } catch (error: any) {
    logger.error('Error fetching comments:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
