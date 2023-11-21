import express from 'express';
import * as userController from '../controller/user.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const userRouter = express.Router();
/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Endpoints related to user
 */
/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile information.
 *     tags: [Users]
 *     security:
 *       - AuthToken: [] 
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               username: 'User Name'
 *               email: 'user@example.com'
 *               fullName: 'John Doe'
 *               createdAt: '2023-11-20T12:00:00Z'
 *               updatedAt: '2023-11-21T12:00:00Z'
 *       '401':
 *         description: User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               message: 'User not authenticated. Please log in.'
 *       '500':
 *         description: Internal Server Error.
 */
const userRoutes = [
  {
    method: 'get',
    path: '/profile',
    middleware: auth,
    handler: userController.profile,
  },
];

userRoutes.forEach((route) => {
  (userRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default userRouter;
