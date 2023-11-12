import express from 'express';
import * as boardController from '../controller/board.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const boardRouter = express.Router();

const boardRoutes = [
  {
    method: 'post',
    path: '/',
    middleware: auth,
    handler: boardController.createBoard,
  },
  {
    method: 'put',
    path: '/:id/close',
    middleware: auth,
    handler: boardController.closeBoard,
  },
  {
    method: 'put',
    path: '/:id/re-open',
    middleware: auth,
    handler: boardController.reopenBoard,
  },
  {
    method: 'get',
    path: '/:workspaceId/boards',
    middleware: auth,
    handler: boardController.getAllOpenBoards,
  },
  {
    method: 'get',
    path: '/:workspaceId/boards/:id',
    middleware: auth,
    handler: boardController.getSpecificBoard,
  },
  {
    method: 'delete',
    path: '/:id',
    middleware: auth,
    handler: boardController.deleteBoard,
  },
  {
    method: 'put',
    path: '/:id',
    middleware: auth,
    handler: boardController.updateBoard,
  },
  {
    method: 'post',
    path: '/:id/members',
    middleware: auth,
    handler: boardController.addMemberToBoard,
  },
  {
    method: 'delete',
    path: '/:id/members/:userId',
    middleware: auth,
    handler: boardController.removeMemberFromBoard,
  },
  {
    method: 'get',
    path: '/:id/members',
    middleware: auth,
    handler: boardController.getAllMembers,
  },
];

boardRoutes.forEach((route) => {
  (boardRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default boardRouter;
