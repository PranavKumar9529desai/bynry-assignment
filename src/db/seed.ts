import { db } from '.'; // Assumes db/index.ts is in the same directory
import { users } from './schema'; // Assumes db/schema.ts is in the same directory
import { mockProfiles } from '../app/data/mockProfiles'; // Adjust path as needed
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

// Load environment variables from .env file in the root directory
dotenv.config({ path: '../../.env' }); // Go up two levels to find .env

async function seedDatabase() {
  console.log('Seeding database...');

  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  try {
    // Map mockProfiles data to the users table structure
    const userData = mockProfiles.map(profile => {
      // Basic validation for required fields
      if (!profile.name || !profile.description || !profile.address || !profile.contactInfo?.email) {
        console.warn(`Skipping profile due to missing required fields: ${profile.name || 'Unnamed'}`);
        return null; // Skip this profile if essential data is missing
      }
      if (typeof profile.address.latitude !== 'number' || typeof profile.address.longitude !== 'number') {
        console.warn(`Skipping profile due to invalid coordinates: ${profile.name}`);
        return null; // Skip if coordinates are invalid
      }

      return {
        // Map basic info
        fullName: profile.name,
        photo: profile.photo,
        description: profile.description,

        // Map address details
        street: profile.address.street,
        city: profile.address.city,
        state: profile.address.state,
        zipCode: profile.address.zipCode,
        country: profile.address.country,
        // Drizzle numeric expects string or number; ensure they are valid numbers
        latitude: profile.address.latitude.toString(),
        longitude: profile.address.longitude.toString(),

        // Map contact info
        email: profile.contactInfo.email, // Already checked for existence
        phone: profile.contactInfo.phone, // Optional
        website: profile.contactInfo.website, // Optional

        // Map interests (provide empty array if undefined/null)
        interests: profile.interests ?? [],

        // Map timestamps (use the dates from mock data)
        // Drizzle expects Date objects for timestamp columns
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };
    }).filter((user): user is NonNullable<typeof user> => user !== null); // Filter out null entries and assert type

    if (userData.length === 0) {
        console.log('No valid user data found in mockProfiles to seed.');
        return;
    }

    console.log(`Attempting to insert ${userData.length} users...`);

    // Clear existing users before seeding (optional, be careful!)
    console.log('Clearing existing users table...');
    await db.delete(users);
    console.log('Users table cleared.');

    // Reset sequence for serial ID (optional, useful for consistent IDs during testing)
    // Note: Sequence name might vary based on your table/column names. Default is usually users_id_seq
    try {
        console.log('Resetting user ID sequence...');
        await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
        console.log('User ID sequence reset.');
    } catch (seqError) {
        console.warn('Could not reset sequence (may not exist or different name):', seqError);
    }


    // Insert new users
    // Drizzle expects an array of objects for batch insert
    console.log('Inserting new users...');
    const insertedUsers = await db.insert(users).values(userData).returning({
        insertedId: users.id,
        insertedEmail: users.email
    });

    console.log(`Successfully seeded ${insertedUsers.length} users.`);
    console.log('Inserted emails:', insertedUsers.map(u => u.insertedEmail));

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit with error code
  } finally {
    console.log('Database seeding finished.');
    // For neon serverless, explicit closing isn't usually needed, but good practice if applicable
    // await db.close(); // Or equivalent method if your driver has one
    process.exit(0); // Exit successfully
  }
}

seedDatabase(); 