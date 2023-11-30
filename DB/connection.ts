import { createConnection, getConnectionOptions } from 'typeorm';
import logger from '../logger';

export const connectDB = async () => {
  try {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return createConnection({ ...connectionOptions, name: 'default' });
  } catch (error) {
    logger.error(`Error when connecting to the database: ${error}`);
    throw error;
  }
};
