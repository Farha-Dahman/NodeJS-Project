import { AppDataSource } from './src/data-source';

module.exports = {
  ...AppDataSource.options,
  synchronize: false,
  logging: false,
};
