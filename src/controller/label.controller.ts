import { Request, Response } from 'express';
import { Like, getRepository } from 'typeorm';
import { BoardLabel } from '../entity/BoardLabel';
import { Board } from '../entity/Board';
import logger from '../../logger';
import { BoardUser } from '../entity/BoardUser';

export const createLabel = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const { title, color } = req.body;
    const numericBoardId = parseInt(boardId, 10);
    const boardRepository = getRepository(Board);
    const boardLabelRepository = getRepository(BoardLabel);

    const board = await boardRepository.findOne({ where: { id: numericBoardId } });
    if (!board) {
      logger.warn('Board not found');
      return res.status(404).json({ message: 'Board not found!' });
    }

    const newLabel = boardLabelRepository.create({
      title,
      color,
      board,
    });

    await boardLabelRepository.save(newLabel);
    logger.info('Label created successfully');
    return res.status(201).json({ message: 'success', label: newLabel });
  } catch (error: any) {
    logger.error('Error creating board label:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteLabel = async (req: Request, res: Response) => {
  const { labelId } = req.params;
  const numericLabelId = parseInt(labelId, 10);
  const boardLabelRepository = getRepository(BoardLabel);
  try {
    const label = await boardLabelRepository.findOne({ where: { id: numericLabelId } });
    if (!label) {
      logger.warn('Label not found');
      return res.status(404).json({ message: 'Label not found!' });
    }

    await boardLabelRepository.remove(label);
    logger.info('Label deleted successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error('Error deleting board label:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const searchForLabel = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      logger.warn('Invalid search query');
      return res.status(400).json({ message: 'Invalid search query' });
    }

    const boardLabelRepository = getRepository(BoardLabel);
    const labels = await boardLabelRepository.find({
      where: {
        title: Like(`%${name}%`),
      },
    });
    logger.info('Searching for board labels successfully');
    return res.status(200).json({ message: 'success', labels });
  } catch (error: any) {
    logger.error('Error searching for board labels:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllLabels = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const numericBoardId = parseInt(boardId, 10);
    const boardLabelRepository = getRepository(BoardLabel);
    const labels = await boardLabelRepository.find({
      where: { board: { id: numericBoardId } },
    });

    logger.info('fetching all labels successfully');
    return res.status(200).json({ message: 'success', labels: labels });
  } catch (error: any) {
    logger.error('Error fetching board labels:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const updateLabel = async (req: Request, res: Response) => {
  const boardLabelRepository = getRepository(BoardLabel);
  const boardUserRepository = getRepository(BoardUser);
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    const { user } = req as any;
    const isMember = await boardUserRepository.findOne({
      where: {
        userId: user.id,
        boardId: req.body.boardId,
      },
    });

    if (!isMember) {
      logger.info('You are not a member of this board');
      return res.status(403).json({ message: 'You are not a member of this board' });
    }

    const label = await boardLabelRepository.findOne({
      where: { id: numericId },
    });
    
    if (!label) {
      logger.info('Label not found');
      return res.status(404).json({ message: 'Label not found!' });
    }
    if (req.body.title) {
      label.title = req.body.title;
      logger.info('User update label title');
    }
    if (req.body.color) {
      label.color = req.body.color;
      logger.info('User update label color');
    }
    await boardLabelRepository.save(label);
    logger.info('Label updated successfully');
    return res.status(200).json({ message: 'success', label });
  } catch (error: any) {
    logger.error('Error updating label: ', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
