import express from 'express';
import * as userController from '../controller/user.controller';
import { auth } from '../middleware/auth.middleware';
import logger from '../../logger';
import fileUpload, { attachmentValidation } from '../middleware/multer';
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
/**
 * @swagger
 * /user/change-password:
 *   patch:
 *     summary: Change user password
 *     description: Change the password for the authenticated user.
 *     tags: [Users]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: body
 *         name: ChangePasswordRequest
 *         description: Request body for changing the password
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             currentPassword:
 *               type: string
 *               description: The current password of the user.
 *             newPassword:
 *               type: string
 *               description: The new password to set.
 *             confirmNewPassword:
 *               type: string
 *               description: Confirmation of the new password.
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Success message.
 *       400:
 *         description: Invalid request or new password does not match confirmation.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message.
 *       401:
 *         description: Current password is incorrect.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message.
 *       404:
 *         description: User not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message.
 *       500:
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /user/profile-picture:
 *   patch:
 *     summary: Upload or update user profile picture
 *     tags: [Users]
 *     security:
 *       - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: User profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request, please provide a file
 *       '404':
 *         description: File not found, please provide a file
 *       '500':
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /user/update-profile:
 *   put:
 *     summary: Update user profile information
 *     tags: [Users]
 *     security:
 *       - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The user's full name
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               phone:
 *                 type: string
 *                 description: The user's phone number
 *               jobTitle:
 *                 type: string
 *                 description: The user's job title
 *     responses:
 *       '200':
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
const userRoutes = [
  {
    method: 'get',
    path: '/profile',
    middleware: auth,
    handler: userController.profile,
  },
  {
    method: 'patch',
    path: '/change-password',
    middleware: auth,
    handler: userController.changePassword,
  },
  {
    method: 'put',
    path: '/update-profile',
    middleware: auth,
    handler: userController.updateProfile,
  },
  {
    method: 'patch',
    path: '/profile-picture',
    middleware: [fileUpload(attachmentValidation.image).single('attachment'), auth],
    handler: userController.profilePicture,
  },
];

userRoutes.forEach((route) => {
  (userRouter as any)[route.method](route.path, route.middleware, route.handler);
  logger.info(`Route configured: ${route.method} ${route.path}`);
});

export default userRouter;
