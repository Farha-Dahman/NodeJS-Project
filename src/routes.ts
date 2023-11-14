import { Request, Response } from 'express';
import authRouter from './router/auth.router';
import userRouter from './router/user.router';
import workspaceRouter from './router/workspace.router';
import boardRouter from './router/board.router';
import listRouter from './router/list.router';
import cardRouter from './router/card.router';

export const AppRoutes = [
  {
    path: '/',
    method: 'all',
    action: (req: Request, res: Response) => {
      res.json({ message: 'welcome!' });
    },
  },
  {
    path: '/auth',
    method: 'use',
    action: authRouter,
  },
  {
    path: '/user',
    method: 'use',
    action: userRouter,
  },
  {
    path: '/w',
    method: 'use',
    action: workspaceRouter,
  },
  {
    path: '/b',
    method: 'use',
    action: boardRouter,
  },
  {
    path: '/l',
    method: 'use',
    action: listRouter,
  },
  {
    path: '/c',
    method: 'use',
    action: cardRouter,
  },
  {
    path: '*',
    method: 'all',
    action: (req: Request, res: Response) => {
      res.json({ message: 'page not found' });
    },
  },
];
