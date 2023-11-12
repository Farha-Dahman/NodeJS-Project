import { Request, Response } from 'express';
import authRouter from './router/auth.router';
import userRouter from './router/user.router';
import workspaceRouter from './router/workspace.router';

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
    path: '*',
    method: 'all',
    action: (req: Request, res: Response) => {
      res.json({ message: 'page not found' });
    },
  },
];
