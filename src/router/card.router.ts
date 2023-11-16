import express from 'express';
import * as cardController from '../controller/card.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const cardRouter = express.Router();

const cardRoutes = [
  {
    method: 'post',
    path: '/:listId',
    middleware: auth,
    handler: cardController.createCard,
  },
  {
    method: 'put',
    path: '/:boardId/:id',
    middleware: auth,
    handler: cardController.updateCard,
  },
  {
    method: 'patch',
    path: '/:id/archive',
    middleware: auth,
    handler: cardController.archiveCard,
  },
  {
    method: 'patch',
    path: '/:id/un-archive',
    middleware: auth,
    handler: cardController.unarchiveCard,
  },
  {
    method: 'get',
    path: '/:listId/cards',
    middleware: auth,
    handler: cardController.getAllCard,
  },
  {
    method: 'delete',
    path: '/:id',
    middleware: auth,
    handler: cardController.deleteCard,
  },
  {
    method: 'post',
    path: '/:id/members',
    middleware: auth,
    handler: cardController.addMemberToCard,
  },
  {
    method: 'delete',
    path: '/:id/members/:userId',
    middleware: auth,
    handler: cardController.deleteMemberFromCard,
  },
  {
    method: 'get',
    path: '/:id',
    middleware: auth,
    handler: cardController.getAllMembersForCard,
  },
  {
    method: 'get',
    path: '/:id/activities',
    middleware: auth,
    handler: cardController.getActivities,
  }
];

cardRoutes.forEach((route) => {
  (cardRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default cardRouter;
