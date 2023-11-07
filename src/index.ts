import 'reflect-metadata';
import express from 'express';
import { config } from 'dotenv';
import { AppRoutes } from './routes';
import { connectDB } from '../DB/connection';
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
    console.log(`Application is up and running on port ${PORT}`);
  });
}

startServer();
