import express from 'express';
import * as notificationController from '../controller/notification.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const notificationRouter = express.Router();

const notificationRoutes = [
  {
    method: 'get',
    path: '/:userId',
    middleware: auth,
    handler: notificationController.getNotifications,
  },
  {
    method: 'patch',
    path: '/:notificationId',
    middleware: auth,
    handler: notificationController.changeNotificationReadStatus,
  }
];

notificationRoutes.forEach((route) => {
  (notificationRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default notificationRouter;
