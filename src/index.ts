import 'reflect-metadata';
import * as express from 'express';
import { AppDataSource } from './data-source';
import { config } from 'dotenv';
config();
const PORT = process.env.PORT || 8000;

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(express.json());

  app.get('/test', (req, res) => {
    res.send('This is a test endpoint');
  });

  return app.listen(PORT, () => {
    console.log(`Application is up and running on port ${PORT}`);
  });
});
