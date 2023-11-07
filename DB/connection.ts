import { createConnection } from 'typeorm';

export const connectDB = async () => {
  try {
    const connection = await createConnection();
    console.log('Connected to the database');
    return connection;
  } catch (error) {
    console.error(`Error when connecting to the database: ${error}`);
    throw error;
  }
};
