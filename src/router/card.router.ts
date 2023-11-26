import express from 'express';
import logger from '../../logger';
import * as attachmentController from '../controller/attachment.controller';
import * as cardController from '../controller/card.controller';
import { auth } from '../middleware/auth.middleware';
import fileUpload, { attachmentValidation } from '../middleware/multer';

const cardRouter = express.Router();
/**
 * @swagger
 * tags:
 *  name: Cards
 *  description: Endpoints related to card
 */
/**
 * @swagger
 * /c/{listId}:
 *   post:
 *     summary: Create a new card in a list.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         description: ID of the list where the card will be created.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Card details to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the card.
 *               description:
 *                 type: string
 *                 description: The description of the card.
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The due date of the card.
 *               reminderDate:
 *                 type: string
 *                 format: date-time
 *                 description: The reminder date of the card.
 *             example:
 *               title: "Card title"
 *               description: "This is a description for card."
 *               dueDate: "2023-11-01T12:00:00Z"
 *               reminderDate: "2023-11-30T12:00:00Z"
 *     responses:
 *       '201':
 *         description: Card created successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               card:
 *                 id: 1
 *                 title: 'Sample Card'
 *                 description: 'This is a sample card.'
 *                 dueDate: '2023-12-01T12:00:00Z'
 *                 reminderDate: '2023-11-20T12:00:00Z'
 *                 createdDate: '2023-11-20T00:00:00Z'
 *                 isArchived: false
 *                 users: [{ id: 1, username: 'user1' }]
 *                 list: { id: 1, title: 'Sample List', position: 1 }
 *       '401':
 *         description: User not found! Should make log in.
 *       '404':
 *         description: List not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{boardId}/{id}:
 *   put:
 *     summary: Update a card in a board.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the card to be updated.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: boardId
 *         description: ID of the board where the card belongs.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Card details to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the card.
 *               description:
 *                 type: string
 *                 description: The updated description of the card.
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The updated due date of the card.
 *               reminderDate:
 *                 type: string
 *                 format: date-time
 *                 description: The updated reminder date of the card.
 *             example:
 *               title: "Updated Card Title"
 *               description: "This is an updated card description."
 *               dueDate: "2023-11-20T12:00:00Z"
 *               reminderDate: "2023-11-21T12:00:00Z"
 *     responses:
 *       '200':
 *         description: Card updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               card:
 *                 id: 1
 *                 title: 'Updated Card Title'
 *                 description: 'This is an updated card description.'
 *                 dueDate: '2023-12-15T12:00:00Z'
 *                 reminderDate: '2023-11-20T12:00:00Z'
 *                 createdDate: '2023-11-21T00:00:00Z'
 *                 isArchived: false
 *                 users: [{ id: 1, username: 'user1' }]
 *                 list: { id: 1, title: 'Sample List', position: 1 }
 *       '403':
 *         description: Cannot update this card! You are not a member of this board.
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}/archive:
 *   patch:
 *     summary: Archive a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the card to be archived.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Card archived successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               card:
 *                 id: 1
 *                 title: 'Archived Card Title'
 *                 description: 'This card has been archived.'
 *                 dueDate: '2023-12-15T12:00:00Z'
 *                 reminderDate: '2023-11-20T12:00:00Z'
 *                 createdDate: '2023-11-21T00:00:00Z'
 *                 isArchived: true
 *                 users: [{ id: 1, username: 'user1' }]
 *                 list: { id: 1, title: 'Sample List', position: 1 }
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}/un-archive:
 *   patch:
 *     summary: Un-archive a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the card to be unarchived.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Card unarchived successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               card:
 *                 id: 1
 *                 title: 'Un-archived Card Title'
 *                 description: 'This card has been unarchived.'
 *                 dueDate: '2023-12-15T12:00:00Z'
 *                 reminderDate: '2023-11-20T12:00:00Z'
 *                 createdDate: '2023-11-21T00:00:00Z'
 *                 isArchived: false
 *                 users: [{ id: 1, username: 'user1' }]
 *                 list: { id: 1, title: 'Sample List', position: 1 }
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{listId}/cards:
 *   get:
 *     summary: Get all cards in a list.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         description: ID of the list to retrieve cards from.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved cards.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               cards:
 *                 - id: 1
 *                   title: 'Card Title 1'
 *                   description: 'Description of Card 1'
 *                   dueDate: '2023-12-15T12:00:00Z'
 *                   reminderDate: '2023-12-14T12:00:00Z'
 *                   createdDate: '2023-11-30T00:00:00Z'
 *                   isArchived: false
 *                   users: [{ id: 1, username: 'user1' }]
 *                   list: { id: 1, title: 'List title', position: 1 }
 *                 - id: 2
 *                   title: 'Card Title 2'
 *                   description: 'Description of Card 2'
 *                   dueDate: '2023-12-16T12:00:00Z'
 *                   reminderDate: '2023-11-20T12:00:00Z'
 *                   createdDate: '2023-11-21T00:00:00Z'
 *                   isArchived: false
 *                   users: [{ id: 2, username: 'user2' }]
 *                   list: { id: 1, title: 'List title', position: 1 }
 *       '403':
 *         description: User does not have permission to show cards.
 *       '404':
 *         description: List not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}:
 *   delete:
 *     summary: Delete a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the card to be deleted.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted the card.
 *       '403':
 *         description: User does not have permission to delete the card.
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}/members:
 *   post:
 *     summary: Add a member to a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the card to add a member to.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         description: Email of the user to be added to the card.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *         example:
 *           email: user@example.com
 *     responses:
 *       '201':
 *         description: Successfully added a member to the card.
 *       '403':
 *         description: User does not have permission to add a member to the card.
 *       '404':
 *         description: Card or user not found.
 *       '409':
 *         description: User is already a member of the card.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a member from a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the card from which to remove the member.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         description: ID of the user to be removed from the card.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully removed a member from the card.
 *       '404':
 *         description: Card or user not found in the card.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}:
 *   get:
 *     summary: Get all members for a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the card for which to retrieve members.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved members for the card.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               members:
 *                 - id: 1
 *                   fullName: user name
 *                   email: user@example.com
 *                 - id: 2
 *                   fullName: user name
 *                   email: user@example.com
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}:
 *   get:
 *     summary: Get all members for a card.
 *     tags:
 *       - Cards
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the card for which to retrieve members.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved members for the card.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               members:
 *                 - id: 1
 *                   fullName: User Name
 *                   email: user@example.com
 *                 - id: 2
 *                   fullName: User Name
 *                   email: user@example.com
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}/activities:
 *   get:
 *     summary: Get activities for a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the card for which to retrieve activities.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved activities for the card.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               activities:
 *                 - id: 1
 *                   action: 'update'
 *                   description: 'Card details updated'
 *                   createdDate: '2023-11-20T12:34:56Z'
 *                 - id: 2
 *                   action: 'comment'
 *                   description: 'Added a comment'
 *                   createdDate: '2023-11-21T10:45:30Z'
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{cardId}/comment:
 *   post:
 *     summary: Add a comment to a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         description: ID of the card to which the comment will be added.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Comment content to be added to the card.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment.
 *     responses:
 *       '201':
 *         description: Successfully added a comment to the card.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               comment:
 *                 id: 1
 *                 content: 'This is a comment.'
 *                 user:
 *                   id: 123
 *                   fullName: 'John Doe'
 *                 card:
 *                   id: 456
 *                   title: 'Example Card'
 *                 createdDate: '2023-11-20T14:30:00Z'
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}/comment:
 *   delete:
 *     summary: Delete a comment.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the comment to be deleted.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted the comment.
 *       '404':
 *         description: Comment not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{id}/comment:
 *   patch:
 *     summary: Edit a comment.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the comment to be edited.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         description: Request body containing the updated content.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *     responses:
 *       '200':
 *         description: Successfully edited the comment.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               comment:
 *                 id: 1
 *                 content: 'Updated content'
 *                 user: { id: 123, username: 'user123' }
 *                 card: { id: 456, title: 'Card Title' }
 *                 createdDate: '2023-11-20T12:00:00Z'
 *       '404':
 *         description: Comment not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{cardId}/comments:
 *   get:
 *     summary: Get all comments for a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         description: ID of the card to fetch comments for.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully fetched comments for the card.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               comments:
 *                 - id: 1
 *                   content: 'Comment content 1'
 *                   user: { id: 123, username: 'user123' }
 *                   card: { id: 456, title: 'Card Title' }
 *                   createdDate: '2023-01-01T12:00:00Z'
 *                 - id: 2
 *                   content: 'Comment content 2'
 *                   user: { id: 456, username: 'user456' }
 *                   card: { id: 456, title: 'Card Title' }
 *                   createdDate: '2023-11-20T13:00:00Z'
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{cardId}/attachments:
 *   post:
 *     summary: Upload an attachment to a card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         description: ID of the card to upload the attachment to.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: attachment
 *         description: The attachment file to upload.
 *         required: true
 *         type: file
 *     responses:
 *       '201':
 *         description: Attachment uploaded successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               attachment:
 *                 id: 1
 *                 name: 'example_image.jpg'
 *                 uploadedDate: '2023-01-01T14:00:00Z'
 *                 location: {
 *                   public_id: 'public_id_here',
 *                   secure_url: 'secure_url_here'
 *                 }
 *                 card: { id: 456, title: 'Card Title' }
 *       '400':
 *         description: No file uploaded.
 *       '404':
 *         description: Card not found.
 *       '500':
 *         description: Internal Server Error.
 *     produces:
 *       - application/json
 *     consumes:
 *       - multipart/form-data
 */
/**
 * @swagger
 * /c/{attachmentId}/attachments:
 *   delete:
 *     summary: Delete an attachment.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         description: ID of the attachment to delete.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Attachment deleted successfully.
 *       '404':
 *         description: Attachment not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{attachmentId}/attachments:
 *   patch:
 *     summary: Update the name of an attachment.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         description: ID of the attachment to update.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         description: Request body for updating the attachment name.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newName:
 *                   type: string
 *                   description: New name for the attachment.
 *     responses:
 *       '200':
 *         description: Attachment name updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               attachment:
 *                 id: 1
 *                 name: 'newName.jpg'
 *                 uploadedDate: '2023-11-01T12:00:00Z'
 *                 location:
 *                   public_id: '123456'
 *                   secure_url: 'https://example.com/newName.jpg'
 *                 card:
 *                   id: 1
 *       '404':
 *         description: Attachment not found.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /c/{cardId}/attachments:
 *   get:
 *     summary: Get all attachments for a specific card.
 *     tags: [Cards]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         description: ID of the card to get attachments for.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Attachments retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: 'success'
 *               attachments:
 *                 - id: 1
 *                   name: 'attachment1.jpg'
 *                   uploadedDate: '2023-11-20T12:00:00Z'
 *                   location:
 *                     public_id: '321'
 *                     secure_url: 'https://example.com/attachment1.jpg'
 *                   card:
 *                     id: 1
 *                 - id: 2
 *                   name: 'attachment2.png'
 *                   uploadedDate: '2023-11-21T12:00:00Z'
 *                   location:
 *                     public_id: '123'
 *                     secure_url: 'https://example.com/attachment2.png'
 *                   card:
 *                     id: 1
 *       '404':
 *         description: Attachments not found for the specified card.
 *       '500':
 *         description: Internal Server Error.
 */
const cardRoutes = [
  {
    method: 'post',
    path: '/:listId',
    middleware: auth,
    handler: cardController.createCard,
  },
  {
    method: 'put',
    path: '/:boardId/:id',
    middleware: auth,
    handler: cardController.updateCard,
  },
  {
    method: 'patch',
    path: '/:id/archive',
    middleware: auth,
    handler: cardController.archiveCard,
  },
  {
    method: 'patch',
    path: '/:id/un-archive',
    middleware: auth,
    handler: cardController.unarchiveCard,
  },
  {
    method: 'get',
    path: '/:listId/cards',
    middleware: auth,
    handler: cardController.getAllCard,
  },
  {
    method: 'delete',
    path: '/:id',
    middleware: auth,
    handler: cardController.deleteCard,
  },
  {
    method: 'post',
    path: '/:id/members',
    middleware: auth,
    handler: cardController.addMemberToCard,
  },
  {
    method: 'delete',
    path: '/:id/members/:userId',
    middleware: auth,
    handler: cardController.deleteMemberFromCard,
  },
  {
    method: 'get',
    path: '/:id',
    middleware: auth,
    handler: cardController.getAllMembersForCard,
  },
  {
    method: 'get',
    path: '/:id/activities',
    middleware: auth,
    handler: cardController.getActivities,
  },
  {
    method: 'post',
    path: '/:cardId/comment',
    middleware: auth,
    handler: cardController.addComment,
  },
  {
    method: 'delete',
    path: '/:id/comment',
    middleware: auth,
    handler: cardController.deleteComment,
  },
  {
    method: 'patch',
    path: '/:id/comment',
    middleware: auth,
    handler: cardController.editComment,
  },
  {
    method: 'get',
    path: '/:cardId/comments',
    middleware: auth,
    handler: cardController.getAllComments,
  },
  {
    method: 'post',
    path: '/:cardId/attachments',
    middleware: [
      fileUpload(attachmentValidation.image.concat(attachmentValidation.file)).single('attachment'),
      auth,
    ],
    handler: attachmentController.uploadAttachment,
  },
  {
    method: 'delete',
    path: '/:attachmentId/attachments',
    middleware: auth,
    handler: attachmentController.deleteAttachment,
  },
  {
    method: 'patch',
    path: '/:attachmentId/attachments',
    middleware: auth,
    handler: attachmentController.updateAttachment,
  },
  {
    method: 'get',
    path: '/:cardId/attachments',
    middleware: auth,
    handler: attachmentController.getAllAttachments,
  },
];

cardRoutes.forEach((route) => {
  (cardRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default cardRouter;
