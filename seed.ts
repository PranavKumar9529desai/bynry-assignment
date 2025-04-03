import { db } from './src/db'; // Adjust path if seed.ts is not in root
import { users } from './src/db/schema'; // Adjust path if seed.ts is not in root
import { mockProfiles } from './src/app/data/mockProfiles'; // Adjust path if seed.ts is not in root
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function seedDatabase() {
  console.log('Seeding database...');

  try {
    // Map mockProfiles data to the users table structure
    const userData = mockProfiles.map(profile => ({
      // Map basic info
      fullName: profile.name,
      photo: profile.photo,
      description: profile.description,

      // Map address details (handle potential undefined address)
      street: profile.address?.street,
      city: profile.address?.city,
      state: profile.address?.state,
      zipCode: profile.address?.zipCode,
      country: profile.address?.country,
      // Ensure latitude/longitude are numbers, provide null if not available
      latitude: typeof profile.address?.latitude === 'number' ? profile.address.latitude.toString() : null, // Drizzle numeric expects string or number
      longitude: typeof profile.address?.longitude === 'number' ? profile.address.longitude.toString() : null, // Drizzle numeric expects string or number

      // Map contact info (handle potential undefined contactInfo and fields)
      email: profile.contactInfo?.email,
      phone: profile.contactInfo?.phone,
      website: profile.contactInfo?.website,

      // Map interests (provide empty array if undefined/null)
      interests: profile.interests ?? [],

      // Map timestamps (use the dates from mock data)
      // Drizzle expects Date objects for timestamp columns
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,

    })).filter(user => user.email); // Ensure we only insert users with an email (as it's unique)

    if (userData.length === 0) {
        console.log('No valid user data found in mockProfiles to seed.');
        return;
    }

    console.log(`Inserting ${userData.length} users...`);

    // Clear existing users before seeding (optional, be careful!)
    console.log('Clearing existing users...');
    await db.delete(users); // Uncomment this line if you want to clear the table first

    // Insert new users
    // Drizzle expects an array of objects for batch insert
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
    process.exit(0); // Exit successfully
  }
}

seedDatabase(); 