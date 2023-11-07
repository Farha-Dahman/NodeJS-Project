import express from 'express';
import * as authController from '../controller/auth.controller';
import { loginSchema, signupSchema } from '../schema/auth.schema';
import { validation } from '../middleware/validation';
const authRouter = express.Router();

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
});

export default authRouter;
