import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8000',
  },
  env: {
    BEARER_KEY: process.env.BEARER_KEY || 'trelloAppBearer_',
  },
});
