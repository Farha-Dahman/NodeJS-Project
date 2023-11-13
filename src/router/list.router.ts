import express from 'express';
import * as listController from '../controller/list.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const listRouter = express.Router();

const listRoutes = [
  {
    method: 'post',
    path: '/:boardId',
    middleware: auth,
    handler: listController.createList,
  },
  {
    method: 'patch',
    path: '/:id',
    middleware: auth,
    handler: listController.updateList,
  },
  {
    method: 'patch',
    path: '/:id/archive',
    middleware: auth,
    handler: listController.archiveList,
  },
  {
    method: 'patch',
    path: '/:id/un-archive',
    middleware: auth,
    handler: listController.unarchiveList,
  },
  {
    method: 'get',
    path: '/:boardId/lists',
    middleware: auth,
    handler: listController.getAllList,
  },
  {
    method: 'delete',
    path: '/:id',
    middleware: auth,
    handler: listController.deleteList,
  },
];

listRoutes.forEach((route) => {
  (listRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default listRouter;
