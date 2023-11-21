import express from 'express';
import * as authController from '../controller/auth.controller';
import { loginSchema, signupSchema } from '../schema/auth.schema';
import { validation } from '../middleware/validation';
import logger from '../../logger';
const authRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */
/**
 * @swagger
 * paths:
 *  /auth/signup:
 *    post:
 *      summary: User signup
 *      description: Register a new user account.
 *      tags: [Authentication]
 *      requestBody:
 *        description: User signup data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                fullName:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *                cPassword:
 *                  type: string
 *                  format: password
 *              required:
 *                - fullName
 *                - email
 *                - password
 *                - cPassword   
 *      responses:
 *        200:
 *          description: User registered successfully
 *        400:
 *          description: Email already exists or invalid signup data
 *        409:
 *          description: Email already exists
 *        500:
 *          description: Internal Server Error
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return access and refresh tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *              required:
 *                - email
 *                - password
 *     responses:
 *       '200':
 *         description: Successfully logged in. Returns access and refresh tokens.
 *       '403':
 *         description: User has not confirmed their email.
 *       '404':
 *         description: Invalid email or password.
 *       '500':
 *         description: Internal Server Error.
 */
/**
 * @swagger
 * /auth/confirmEmail/{token}:
 *   put:
 *     summary: Confirm user email
 *     description: Confirm the user's email using the provided confirmation token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         description: The confirmation token received via email.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Email confirmed successfully.
 *       '401':
 *         description: Invalid token.
 *       '404':
 *         description: Email already verified.
 */
const authRoutes = [
  {
    method: 'post',
    path: '/signup',
    middleware: validation(signupSchema),
    handler: authController.signup,
  },
  {
    method: 'post',
    path: '/login',
    middleware: validation(loginSchema),
    handler: authController.login,
  },
  {
    method: 'put',
    path: '/confirmEmail/:token',
    handler: authController.confirmEmail,
  },
];

authRoutes.forEach((route) => {
  const { method, path, middleware, handler } = route;
  const routeHandlers = middleware ? [middleware, handler] : [handler];
  (authRouter as any)[method](path, ...routeHandlers);
  logger.info(`Route configured: ${method} ${path}`);
});

export default authRouter;
