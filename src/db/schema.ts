import { pgTable, serial, text, varchar, timestamp, numeric } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm'; // Import sql helper

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  photo: text('photo'), // For storing image URL
  description: text('description'),
  street: text('street'),
  city: text('city'),
  state: text('state'),
  zipCode: varchar('zip_code', { length: 20 }), // varchar for flexibility
  country: text('country'),
  latitude: numeric('latitude', { precision: 10, scale: 7 }), // Numeric for coordinates
  longitude: numeric('longitude', { precision: 10, scale: 7 }), // Numeric for coordinates
  email: text('email').unique(), // Assuming email should be unique
  phone: varchar('phone', { length: 50 }), // Increased length for phone
  website: text('website'), // For storing website URL
  interests: text('interests').array(), // Correct way to define a text array
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`), // Default to current time
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`), // Default to current time
});

// You can add more tables here as your application grows
// export const posts = pgTable('posts', { ... }); 