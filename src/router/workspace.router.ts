import express from 'express';
import logger from '../../logger';
import * as workspaceController from '../controller/workspace.controller';
import { auth } from '../middleware/auth.middleware';

const workspaceRouter = express.Router();
/**
 * @swagger
 * tags:
 *  name: Workspaces
 *  description: Endpoints related to workspace
 */
/**
 * @swagger
 * /w/:
 *   post:
 *     summary: Create a new workspace.
 *     tags: [Workspaces]
 *     security:
 *       - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new workspace.
 *               type:
 *                 type: string
 *                 description: The type of the workspace.
 *               description:
 *                 type: string
 *                 description: The description of the workspace.
 *             example:
 *               name: MyWorkspace
 *               type: Public
 *               description: A description of the workspace.
 *     responses:
 *       '201':
 *         description: Workspace created successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               newWorkspace:
 *                 id: 1
 *                 name: MyWorkspace
 *                 type: Public
 *                 description: A workspace for collaboration.
 *       '401':
 *         description: User not found. Should make log in.
 *       '409':
 *         description: Workspace name already exists.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /w/{id}:
 *   get:
 *     summary: Get details of a specific workspace.
 *     tags: [Workspaces]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the workspace to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully fetched details of the workspace.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               workspace:
 *                 id: 1
 *                 name: MyWorkspace
 *                 type: Public
 *                 description: A workspace for collaboration.
 *       '403':
 *         description: Access denied! User is not a member of this workspace.
 *       '404':
 *         description: Workspace not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /w/:
 *   get:
 *     summary: Get all workspaces for the authenticated user.
 *     tags: [Workspaces]
 *     security:
 *       - AuthToken: []
 *     responses:
 *       '200':
 *         description: Successfully fetched user workspaces.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               workspaces:
 *                 - id: 1
 *                   name: MyWorkspace1
 *                   type: Public
 *                   description: A workspace for collaboration.
 *                 - id: 2
 *                   name: MyWorkspace2
 *                   type: Private
 *                   description: Another workspace for private tasks.
 *       '404':
 *         description: No workspaces found for the user.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /w/{id}:
 *   delete:
 *     summary: Delete a workspace.
 *     tags: [Workspaces]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the workspace to be deleted.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Workspace deleted successfully.
 *       '404':
 *         description: Workspace not found.
 *       '403':
 *         description: User is not authorized to delete the workspace.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /w/{id}:
 *   put:
 *     summary: Update a workspace.
 *     tags: [Workspaces]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the workspace to be updated.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Workspace data to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Workspace updated successfully.
 *       '404':
 *         description: Workspace not found.
 *       '403':
 *         description: User is not authorized to update the workspace.
 *       '409':
 *         description: Workspace with the provided name already exists.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /w/{id}/members:
 *   post:
 *     summary: Add a user to a workspace.
 *     tags: [Workspaces]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the workspace to add the user to.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: User data to be added to the workspace.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User added to the workspace successfully.
 *       '404':
 *         description: Workspace or user not found.
 *       '409':
 *         description: User is already a member of this workspace.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /w/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a user from a workspace.
 *     tags: [Workspaces]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the workspace to remove the user from.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         description: ID of the user to be removed from the workspace.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: User removed from the workspace successfully.
 *       '404':
 *         description: Workspace or user not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /w/{id}/members:
 *   get:
 *     summary: Get all members of a workspace.
 *     tags: [Workspaces]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the workspace to get members from.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully fetched members.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               members:
 *                 - id: 1
 *                   fullName: User Name
 *                   email: user@example.com
 *       '404':
 *         description: Workspace not found.
 *       '500':
 *         description: Internal Server Error.
 */
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
