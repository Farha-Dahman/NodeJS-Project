import 'reflect-metadata';
import express from 'express';
import { config } from 'dotenv';
import { AppRoutes } from './routes';
import { connectDB } from '../DB/connection';
import logger from './../logger';
config();
const PORT = process.env.PORT || 8000;
const app = express();

async function startServer() {
  await connectDB();
  app.use(express.json());

  AppRoutes.forEach((route) => {
    const { method, path, action } = route;
    (app as any)[method](path, action);
  });

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

startServer();
