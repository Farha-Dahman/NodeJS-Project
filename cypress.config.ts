import 'dotenv/config';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
  },
  env: {
    BEARER_KEY: process.env.BEARER_KEY,
  },
});
