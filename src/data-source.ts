import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
config();

export const dbConnectionOptions: DataSourceOptions = {
  name: 'development',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: ['src/entity/*.ts'],
  migrations: ['src/migration/*.ts'],
  subscribers: ['src/subscriber/*.ts'],
};

export const testDatabaseConfig: DataSourceOptions = {
  name: 'test',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  dropSchema: true,
  logging: true,
  entities: ['src/entity/*.ts'],
  migrations: ['src/migration/*.ts'],
  subscribers: ['src/subscriber/*.ts'],
};

const dataSourceConfig: DataSourceOptions =
  process.env.NODE_ENV === 'test' ? testDatabaseConfig : dbConnectionOptions;

export const AppDataSource = new DataSource({
  ...dataSourceConfig,
});
