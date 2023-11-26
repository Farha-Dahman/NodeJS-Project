import 'reflect-metadata';
import { config } from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from '../DB/connection';
import swaggerSpec from '../swagger';
import logger from './../logger';
import { AppRoutes } from './routes';

config();
const PORT = process.env.PORT || 8000;
const app = express();

async function startServer() {
  await connectDB();
  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  AppRoutes.forEach((route) => {
    const { method, path, action } = route;
    (app as any)[method](path, action);
  });

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

startServer();
