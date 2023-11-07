import { dbConnectionOptions } from './src/data-source';

module.exports = {
  ...dbConnectionOptions,
  synchronize: false,
  logging: false,
};
