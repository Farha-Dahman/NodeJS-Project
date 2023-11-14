import express from 'express';
import * as labelController from '../controller/label.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const labelRouter = express.Router();

const labelRoutes = [
  {
    method: 'post',
    path: '/:boardId',
    middleware: auth,
    handler: labelController.createLabel,
  },
  {
    method: 'delete',
    path: '/:labelId',
    middleware: auth,
    handler: labelController.deleteLabel,
  },
  {
    method: 'get',
    path: '/search',
    middleware: auth,
    handler: labelController.searchForLabel,
  },
  {
    method: 'get',
    path: '/:boardId',
    middleware: auth,
    handler: labelController.getAllLabels,
  },
  {
    method: 'patch',
    path: '/:id',
    middleware: auth,
    handler: labelController.updateLabel,
  },
];

labelRoutes.forEach((route) => {
  (labelRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default labelRouter;
