import express from 'express';
import * as workspaceController from "../controller/workspace.controller"
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const workspaceRouter = express.Router();

const workspaceRoutes = [
  {
    method: 'post',
    path: '/',
    middleware: auth,
    handler: workspaceController.createWorkspace,
  },
  {
    method: 'get',
    path: '/:id',
    middleware: auth,
    handler: workspaceController.getSpecificWorkspace,
  },
  {
    method: 'get',
    path: '/',
    middleware: auth,
    handler: workspaceController.getAllWorkspace,
  },
  {
    method: 'delete',
    path: '/:id',
    middleware: auth,
    handler: workspaceController.deleteWorkspace,
  },
  {
    method: 'put',
    path: '/:id',
    middleware: auth,
    handler: workspaceController.updateWorkspace,
  },
  {
    method: 'post',
    path: '/:id/members',
    middleware: auth,
    handler: workspaceController.addUserToWorkspace,
  },
  {
    method: 'delete',
    path: '/:id/members/:userId',
    middleware: auth,
    handler: workspaceController.removeUserFromWorkspace,
  },
  {
    method: 'get',
    path: '/:id/members',
    middleware: auth,
    handler: workspaceController.getAllMembers,
  },
];

workspaceRoutes.forEach((route) => {
  (workspaceRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default workspaceRouter;
