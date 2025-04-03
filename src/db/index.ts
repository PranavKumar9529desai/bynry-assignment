import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'; // Import all exports from schema.ts
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required.');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema }); // Pass the schema object

// Now you can import 'db' from this file into your application code
// to perform database operations.
// Example: import { db } from '@/db';
//          const allUsers = await db.select().from(users); 