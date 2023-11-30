import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
};

export default config;
