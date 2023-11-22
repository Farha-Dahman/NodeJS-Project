import express from 'express';
import * as notificationController from '../controller/notification.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const notificationRouter = express.Router();
/**
 * @swagger
 * tags:
 *  name: Notifications
 *  description: Endpoints related to notification
 */
/**
 * @swagger
 * /n/{userId}:
 *   get:
 *     summary: Get notifications for a specific user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []  # Assuming Bearer token authentication
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to retrieve notifications for.
 *     responses:
 *       '200':
 *         description: Notifications retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               notifications:
 *                 - id: 1
 *                   type: 'Removed'
 *                   action: 'You have been removed from the workspace'
 *                   isRead: false
 *                   timestamp: '2023-11-20T07:04:06.304Z'
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /n/{notificationId}:
 *   patch:
 *     summary: Toggle the read status of a notification.
 *     tags: [Notifications]
 *     security:
 *       - AuthToken: [] 
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the notification to toggle the read status.
 *     responses:
 *       '200':
 *         description: Notification read status toggled successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               isRead: true
 *       '404':
 *         description: Notification not found.
 *       '500':
 *         description: Internal Server Error.
 */
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
