import express from 'express';
import * as listController from '../controller/list.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const listRouter = express.Router();
/**
 * @swagger
 * tags:
 *  name: Lists
 *  description: Endpoints related to list
 */
/**
 * @swagger
 * /l/{boardId}:
 *   post:
 *     summary: Create a new list in a board.
 *     tags: [Lists]
 *     security:
 *       - AuthToken: []  
 *     parameters:
 *       - in: path
 *         name: boardId
 *         description: ID of the board in which to create the list.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: List details to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the list.
 *               position:
 *                 type: integer
 *                 description: Position of the list in the board.
 *             required:
 *               - title
 *               - position
 *     responses:
 *       '201':
 *         description: List created successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'List created successfully'
 *               list:
 *                 id: 1
 *                 title: 'Sample List'
 *                 position: 1
 *       '401':
 *         description: User not found. Please log in.
 *       '404':
 *         description: Board not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /l/{id}:
 *   patch:
 *     summary: Update a list.
 *     tags: [Lists]
 *     security:
 *       - AuthToken: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the list to update.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: List details to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the list.
 *               position:
 *                 type: integer
 *                 description: New position of the list.
 *             required:
 *               - title
 *     responses:
 *       '200':
 *         description: List updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               list:
 *                 id: 1
 *                 title: 'Updated List'
 *                 position: 2
 *       '403':
 *         description: New position is the same as the current position.
 *       '404':
 *         description: List not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /l/{id}/archive:
 *   patch:
 *     summary: Archive a list.
 *     tags: [Lists]
 *     security:
 *       - AuthToken: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the list to archive.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List archived successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               list:
 *                 id: 1
 *                 title: 'Archived List'
 *                 position: 2
 *                 isArchived: true
 *       '404':
 *         description: List not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /l/{id}/un-archive:
 *   patch:
 *     summary: Un-archive a list.
 *     tags: [Lists]
 *     security:
 *       - AuthToken: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the list to un-archive.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List unarchived successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               list:
 *                 id: 1
 *                 title: 'Un-archived List'
 *                 position: 2
 *                 isArchived: false
 *       '404':
 *         description: List not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /l/{boardId}/lists:
 *   get:
 *     summary: Get all non-archived lists for a board by ID.
 *     tags: [Lists]
 *     security:
 *       - AuthToken: []  
 *     parameters:
 *       - in: path
 *         name: boardId
 *         description: ID of the board to get lists from.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully fetched non-archived lists.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               lists:
 *                 - id: 1
 *                   title: 'List 1'
 *                   position: 1
 *                   isArchived: false
 *                 - id: 2
 *                   title: 'List 2'
 *                   position: 2
 *                   isArchived: false
 *       '404':
 *         description: Board not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /l/{id}:
 *   delete:
 *     summary: Delete a list.
 *     tags: [Lists]
 *     security:
 *       - AuthToken: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the list to be deleted.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List deleted successfully.
 *       '403':
 *         description: User does not have permission to delete the list.
 *       '404':
 *         description: List not found.
 *       '500':
 *         description: Internal Server Error.
 */
const listRoutes = [
  {
    method: 'post',
    path: '/:boardId',
    middleware: auth,
    handler: listController.createList,
  },
  {
    method: 'patch',
    path: '/:id',
    middleware: auth,
    handler: listController.updateList,
  },
  {
    method: 'patch',
    path: '/:id/archive',
    middleware: auth,
    handler: listController.archiveList,
  },
  {
    method: 'patch',
    path: '/:id/un-archive',
    middleware: auth,
    handler: listController.unarchiveList,
  },
  {
    method: 'get',
    path: '/:boardId/lists',
    middleware: auth,
    handler: listController.getAllList,
  },
  {
    method: 'delete',
    path: '/:id',
    middleware: auth,
    handler: listController.deleteList,
  },
];

listRoutes.forEach((route) => {
  (listRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default listRouter;
