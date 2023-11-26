import express from 'express';
import logger from '../../logger';
import * as boardController from '../controller/board.controller';
import { auth } from '../middleware/auth.middleware';

const boardRouter = express.Router();
/**
 * @swagger
 * tags:
 *  name: Boards
 *  description: Endpoints related to boards
 */
/**
 * @swagger
 * /b/:
 *   post:
 *     summary: Create a new board
 *     description: Create a new board in a workspace.
 *     tags: [Boards]
 *     security:
 *      - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               WorkspaceName:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *             required:
 *               - name
 *               - WorkspaceName
 *               - isPublic
 *     responses:
 *       '201':
 *         description: Board created successfully.
 *       '401':
 *         description: User not found. Please log in.
 *       '404':
 *         description: Workspace not found.
 *       '409':
 *         description: Board name already exists.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{id}/close:
 *   patch:
 *     summary: Close a board
 *     description: Close a board by setting the isClosed property to true.
 *     tags: [Boards]
 *     security:
 *      - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the board to be closed.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Board closed successfully.
 *       '404':
 *         description: Board not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{id}/re-open:
 *   patch:
 *     summary: Reopen a closed board
 *     description: Reopen a previously closed board by setting the isClosed property to false.
 *     tags: [Boards]
 *     security:
 *      - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the board to be reopened.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Board reopened successfully.
 *       '404':
 *         description: Board not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{workspaceId}/boards:
 *   get:
 *     summary: Get all open boards in a workspace.
 *     tags: [Boards]
 *     security:
 *      - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the workspace.
 *     responses:
 *       '200':
 *         description: Successfully retrieved open boards.
 *         content:
 *           application/json:
 *             example:
 *               message: success
 *               boards:
 *                 - id: 1
 *                   name: 'Board 1'
 *                   createdDate: '2023-01-01T00:00:00.000Z'
 *                   isClosed: false
 *                   workspace:
 *                     id: 1
 *                     name: 'Workspace 1'
 *       '404':
 *         description: Workspace not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{workspaceId}/boards/{id}:
 *   get:
 *     summary: Get a specific board in a workspace.
 *     tags: [Boards]
 *     security:
 *      - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the workspace.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board.
 *     responses:
 *       '200':
 *         description: Successfully retrieved the board.
 *         content:
 *           application/json:
 *             example:
 *               message: success
 *               board:
 *                 id: 1
 *                 name: 'Board 1'
 *                 createdDate: '2023-01-01T00:00:00.000Z'
 *                 isClosed: false
 *                 workspace:
 *                   id: 1
 *                   name: 'Workspace 1'
 *       '403':
 *         description: Cannot get the board because it is closed.
 *       '404':
 *         description: Workspace or board not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{id}:
 *   delete:
 *     summary: Delete a board.
 *     tags: [Boards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board to delete.
 *     responses:
 *       '200':
 *         description: Board deleted successfully.
 *       '403':
 *         description: User does not have permission to delete the board.
 *       '404':
 *         description: Board not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{id}:
 *   put:
 *     summary: Update a board.
 *     tags: [Boards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board to update.
 *     requestBody:
 *       description: Board data to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               workspaceName:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *             example:
 *               name: New Board Name
 *               workspaceName: New Workspace Name
 *               isPublic: true
 *     responses:
 *       '200':
 *         description: Board updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Board updated successfully'
 *               board:
 *                 id: 1
 *                 name: New Board Name
 *                 workspaceName: New Workspace Name
 *                 isPublic: true
 *       '403':
 *         description: User does not have permission to update the board.
 *       '404':
 *         description: Board or new workspace not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{id}/members:
 *   post:
 *     summary: Add a member to the board.
 *     tags: [Boards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board to add a member to.
 *     requestBody:
 *       description: Email of the user to add to the board.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: user@example.com
 *     responses:
 *       '201':
 *         description: User added to the board successfully.
 *       '404':
 *         description: Board or user not found.
 *       '409':
 *         description: User is already a member of the board.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a member from the board.
 *     tags: [Boards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board to remove a member from.
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to be removed from the board.
 *     responses:
 *       '200':
 *         description: User removed from the board successfully.
 *       '404':
 *         description: Board not found or user is not a member of the board.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{id}/members:
 *   get:
 *     summary: Get all members of the board.
 *     tags: [Boards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board to get members from.
 *     responses:
 *       '200':
 *         description: Successfully fetched members.
 *       '404':
 *         description: Board not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /b/{id}/activities:
 *   get:
 *     summary: Get board activities.
 *     tags: [Boards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board to get activities from.
 *     responses:
 *       '200':
 *         description: Successfully fetched board activities.
 *       '404':
 *         description: Board not found.
 *       '500':
 *         description: Internal Server Error.
 */
const boardRoutes = [
  {
    method: 'post',
    path: '/',
    middleware: auth,
    handler: boardController.createBoard,
  },
  {
    method: 'patch',
    path: '/:id/close',
    middleware: auth,
    handler: boardController.closeBoard,
  },
  {
    method: 'patch',
    path: '/:id/re-open',
    middleware: auth,
    handler: boardController.reopenBoard,
  },
  {
    method: 'get',
    path: '/:workspaceId/boards',
    middleware: auth,
    handler: boardController.getAllOpenBoards,
  },
  {
    method: 'get',
    path: '/:workspaceId/boards/:id',
    middleware: auth,
    handler: boardController.getSpecificBoard,
  },
  {
    method: 'delete',
    path: '/:id',
    middleware: auth,
    handler: boardController.deleteBoard,
  },
  {
    method: 'put',
    path: '/:id',
    middleware: auth,
    handler: boardController.updateBoard,
  },
  {
    method: 'post',
    path: '/:id/members',
    middleware: auth,
    handler: boardController.addMemberToBoard,
  },
  {
    method: 'delete',
    path: '/:id/members/:userId',
    middleware: auth,
    handler: boardController.removeMemberFromBoard,
  },
  {
    method: 'get',
    path: '/:id/members',
    middleware: auth,
    handler: boardController.getAllMembers,
  },
  {
    method: 'get',
    path: '/:id/activities',
    middleware: auth,
    handler: boardController.getActivities,
  },
];

boardRoutes.forEach((route) => {
  (boardRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default boardRouter;
