import express from 'express';
import * as labelController from '../controller/label.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
const labelRouter = express.Router();
/**
 * @swagger
 * tags:
 *  name: Labels
 *  description: Endpoints related to labels
 */
/**
 * @swagger
 * /labels/{boardId}:
 *   post:
 *     summary: Create a new label for a board.
 *     tags: [Labels]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the board to create a label for.
 *     requestBody:
 *       description: Label details to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the label.
 *               color:
 *                 type: string
 *                 description: The color of the label (e.g. red).
 *             required:
 *               - title
 *               - color
 *     responses:
 *       '201':
 *         description: Label created successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               label:
 *                 id: 1
 *                 title: 'Label 1'
 *                 color: 'red'
 *                 boardId: 123
 *       '404':
 *         description: Board not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /labels/{labelId}:
 *   delete:
 *     summary: Delete a label from a board.
 *     tags: [Labels]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: labelId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the label to be deleted.
 *     responses:
 *       '200':
 *         description: Label deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *       '404':
 *         description: Label not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /labels/search:
 *   get:
 *     summary: Search for board labels by name.
 *     tags: [Labels]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name to search for in board labels.
 *     responses:
 *       '200':
 *         description: Labels retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               labels:
 *                 - id: 1
 *                   title: 'Label 1'
 *                   color: 'red'
 *                   board: { id: 1, title: 'Board 1' }
 *                 - id: 2
 *                   title: 'Label 2'
 *                   color: 'blue'
 *                   board: { id: 1, title: 'Board 1' }
 *       '400':
 *         description: Invalid search query.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /labels/{boardId}:
 *   get:
 *     summary: Get all board labels for a specific board.
 *     tags: [Labels]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the board to retrieve labels for.
 *     responses:
 *       '200':
 *         description: Labels retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               labels:
 *                 - id: 1
 *                   title: 'Label 1'
 *                   color: 'red'
 *                   board: { id: 1, title: 'Board 1' }
 *                 - id: 2
 *                   title: 'Label 2'
 *                   color: 'blue'
 *                   board: { id: 1, title: 'Board 1' }
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /labels/{id}:
 *   patch:
 *     summary: Update a board label.
 *     tags: [Labels]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the label to update.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title for the label.
 *               color:
 *                 type: string
 *                 description: The new color for the label.
 *               boardId:
 *                 type: integer
 *                 description: The ID of the board to which the label belongs.
 *             example:
 *               title: 'Updated Label'
 *               color: 'yellow'
 *               boardId: 1
 *     responses:
 *       '200':
 *         description: Label updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               label:
 *                 id: 1
 *                 title: 'Updated Label'
 *                 color: 'yellow'
 *                 board: { id: 1, title: 'Board 1' }
 *       '403':
 *         description: Forbidden. User is not a member of the board.
 *       '404':
 *         description: Label not found.
 *       '500':
 *         description: Internal Server Error.
 */
const labelRoutes = [
  {
    method: 'post',
    path: '/:boardId',
    middleware: auth,
    handler: labelController.createLabel,
  },
  {
    method: 'delete',
    path: '/:labelId',
    middleware: auth,
    handler: labelController.deleteLabel,
  },
  {
    method: 'get',
    path: '/search',
    middleware: auth,
    handler: labelController.searchForLabel,
  },
  {
    method: 'get',
    path: '/:boardId',
    middleware: auth,
    handler: labelController.getAllLabels,
  },
  {
    method: 'patch',
    path: '/:id',
    middleware: auth,
    handler: labelController.updateLabel,
  },
];

labelRoutes.forEach((route) => {
  (labelRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default labelRouter;
