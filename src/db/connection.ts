import { DataSource, DataSourceOptions, getConnectionOptions } from 'typeorm';
import logger from '../../logger';

const connectDB = async (): Promise<DataSource> => {
  try {
    const connectionOptions: DataSourceOptions = await getConnectionOptions(process.env.NODE_ENV);
    const dataSource = new DataSource({ ...connectionOptions, name: 'default' });
    await dataSource.connect();
    return dataSource;
  } catch (error) {
    logger.error(`Error when connecting to the database: ${error}`);
    throw error;
  }
};

export default connectDB;
