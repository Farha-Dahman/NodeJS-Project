import express from 'express';
import * as userController from '../controller/user.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const userRouter = express.Router();

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
