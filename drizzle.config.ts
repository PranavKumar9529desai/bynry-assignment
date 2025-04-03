import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // Load environment variables from .env

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required.');
}

export default defineConfig({
  schema: './src/db/schema.ts', // Path to your schema file
  out: './drizzle', // Directory to store migration files
  dialect: 'postgresql', // Specify the database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL, // Use the connection string from .env
  },
  verbose: true, // Optional: Enable verbose logging
  strict: true, // Optional: Enable strict mode for type checking
}); 