import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { List } from '../entity/List';
import { Board } from '../entity/Board';
import logger from '../../logger';
import { BoardUser } from '../entity/BoardUser';

export const createList = async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const { title, position } = req.body;
  const boardRepository = getRepository(Board);
  const listRepository = getRepository(List);
  try {
    const { user } = req as any;
    const numericId = parseInt(boardId, 10);
    if (!user) {
      logger.warn('User not found! Should make log in.');
      return res.status(401).json({ message: 'User not found! Please log in.' });
    }
    const board = await boardRepository.findOne({
      where: { id: numericId },
    });

    if (!board) {
      logger.info('Board not found');
      return res.status(404).json({ message: 'Board not found!' });
    }
    const newList = listRepository.create({
      title,
      position,
      board,
    });

    await listRepository.save(newList);
    logger.info('List created successfully');
    return res.status(201).json({ message: 'List created successfully', list: newList });
  } catch (error: any) {
    logger.error(`Error in create a list: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const updateList = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listRepository = getRepository(List);
  try {
    const numericId = parseInt(id, 10);
    const list = await listRepository.findOne({
      where: { id: numericId },
    });

    if (!list) {
      logger.info('List not found');
      return res.status(404).json({ message: 'List not found!' });
    }
    if (req.body.title) {
      list.title = req.body.title;
    }
    if (req.body.position) {
      if (list.position == req.body.position) {
        logger.info('Position is the same as the current position');
        return res
          .status(403)
          .json({ message: 'New position is the same as the current position!' });
      }
      list.position = req.body.position;
    }
    await listRepository.save(list);
    logger.info('List updated successfully');
    return res.status(200).json({ message: 'success', list });
  } catch (error: any) {
    logger.error(`Error updating list: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listRepository = getRepository(List);
  const boardUserRepository = getRepository(BoardUser);
  try {
    const numericId = parseInt(id, 10);
    const { user } = req as any;
    const list = await listRepository.findOne({
      where: { id: numericId },
      relations: ['board'],
    });

    if (!list) {
      logger.info('List not found');
      return res.status(404).json({ message: 'List not found!' });
    }

    const isAdmin = await boardUserRepository.findOne({
      where: {
        userId: user.id,
        boardId: list.board.id,
        isAdmin: true,
      },
    });

    if (!isAdmin) {
      logger.info('User does not have permission to delete the list');
      return res.status(403).json({ message: 'You do not have permission to delete this list!' });
    }
    await listRepository.remove(list);
    logger.info('List deleted successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error(`Error when deleting list: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const archiveList = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listRepository = getRepository(List);
  try {
    const numericId = parseInt(id, 10);
    const list = await listRepository.findOne({
      where: { id: numericId },
    });
    if (!list) {
      logger.info('List not found');
      return res.status(404).json({ message: 'List not found!' });
    }

    list.isArchived = true;
    await listRepository.save(list);
    logger.info('List archived successfully');
    return res.status(200).json({ message: 'success', list });
  } catch (error: any) {
    logger.error(`Error in archiveList endpoint: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const unarchiveList = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listRepository = getRepository(List);
  try {
    const numericId = parseInt(id, 10);
    const list = await listRepository.findOne({
      where: { id: numericId },
    });
    if (!list) {
      logger.info('List not found');
      return res.status(404).json({ message: 'List not found!' });
    }

    list.isArchived = false;
    await listRepository.save(list);
    logger.info('List unarchive successfully');
    return res.status(200).json({ message: 'success', list });
  } catch (error: any) {
    logger.error(`Error in unarchiveList endpoint: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllList = async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const numericId = parseInt(boardId, 10);
  const listRepository = getRepository(List);
  const boardRepository = getRepository(Board);
  try {
    const board = await boardRepository.findOne({
      where: { id: numericId },
    });
    if (!board) {
      logger.info('Board not found');
      return res.status(404).json({ message: 'Board not found' });
    }
    const lists = await listRepository.find({
      where: { board: { id: numericId }, isArchived: false },
    });

    logger.info('Successfully fetched not archived lists');
    return res.status(200).json({ message: 'success', lists: lists });
  } catch (error: any) {
    logger.error(`Error fetching not archived lists: ${error}`);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
