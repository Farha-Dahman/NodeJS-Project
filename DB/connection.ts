import { createConnection } from 'typeorm';
import logger from '../logger';

export const connectDB = async () => {
  try {
    const connection = await createConnection();
    logger.info('Connected to the database');
    return connection;
  } catch (error) {
    logger.error(`Error when connecting to the database: ${error}`);
    throw error;
  }
};
