import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import logger from '../../logger';
import { Card } from '../entity/Card';
import { CardAttachment } from '../entity/CardAttachment';
import { AttachmentResponse } from '../types/types';
import cloudinary from '../services/cloudinary';

export const uploadAttachment = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const { user } = req as any;
    const numericCardId = parseInt(cardId, 10);
    const cardAttachmentRepository = getRepository(CardAttachment);
    const cardRepository = getRepository(Card);

    const card = await cardRepository.findOne({ where: { id: numericCardId } });
    if (!card) {
      logger.info('Card not found');
      return res.status(404).json({ message: 'Card not found!' });
    }

    const file = req.file;
    if (!file) {
      logger.info('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, {
      folder: `${process.env.APP_NAME}/attachment/${numericCardId}/${user.id}`,
    });
    const newAttachment = cardAttachmentRepository.create({
      name: file.originalname,
      uploadedDate: new Date(),
      location: {
        public_id: public_id,
        secure_url: secure_url,
      } as AttachmentResponse,
      card,
    });

    await cardAttachmentRepository.save(newAttachment);
    logger.info('uploading attachment successfully');
    return res.status(201).json({ message: 'success', attachment: newAttachment });
  } catch (error: any) {
    logger.error('Error uploading attachment:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const { attachmentId } = req.params;
    const numericAttachmentId = parseInt(attachmentId, 10);
    const attachmentRepository = getRepository(CardAttachment);
    const attachment = await attachmentRepository.findOne({
      where: { id: numericAttachmentId },
    });

    if (!attachment) {
      logger.info('Attachment not found!');
      return res.status(404).json({ message: 'Attachment not found!' });
    }

    const { public_id } = attachment.location;
    await cloudinary.uploader.destroy(public_id);

    await attachmentRepository.remove(attachment);
    logger.info('deleting attachment successfully');
    return res.status(200).json({ message: 'success' });
  } catch (error: any) {
    logger.error('Error deleting attachment:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const updateAttachment = async (req: Request, res: Response) => {
  try {
    const { attachmentId } = req.params;
    const { newName } = req.body;
    const numericAttachmentId = parseInt(attachmentId, 10);
    const attachmentRepository = getRepository(CardAttachment);

    const attachment = await attachmentRepository.findOne({
      where: { id: numericAttachmentId },
    });

    if (!attachment) {
      logger.info('Attachment not found!');
      return res.status(404).json({ message: 'Attachment not found!' });
    }

    attachment.name = newName;
    await attachmentRepository.save(attachment);
    logger.info('updating attachment name successfully');
    return res.status(200).json({ message: 'success', attachment });
  } catch (error: any) {
    logger.error('Error updating attachment name:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllAttachments = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const numericCardId = parseInt(cardId, 10);
    const cardAttachmentRepository = getRepository(CardAttachment);
    const cardRepository = getRepository(Card);
    const card = await cardRepository.findOne({ where: { id: numericCardId } });

    if (!card) {
      logger.info('Card not found');
      return res.status(404).json({ message: 'Card not found!' });
    }

    const attachments = await cardAttachmentRepository.find({
      where: { card: { id: numericCardId } },
    });
    logger.info('getting attachments successfully');
    return res.status(200).json({ message: 'success', attachments });
  } catch (error: any) {
    logger.error('Error getting attachments:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
