'use server'; // Mark this file as containing Server Actions

import { db } from '@/db'; // Adjust import path if needed
import { users } from '@/db/schema'; // Adjust import path if needed
import { Profile, ProfileFormData } from '@/app/types/profile'; // Adjust import path if needed
import { eq, sql, ilike, or, and, asc, desc, isNotNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Helper function to map database user to Profile type
// Note: Drizzle returns numeric as string, need to parse
const mapDbUserToProfile = (dbUser: typeof users.$inferSelect): Profile => ({
  id: dbUser.id.toString(), // Convert id to string
  name: dbUser.fullName ?? '',
  photo: dbUser.photo ?? '',
  description: dbUser.description ?? '',
  address: {
    street: dbUser.street ?? '',
    city: dbUser.city ?? '',
    state: dbUser.state ?? '',
    zipCode: dbUser.zipCode ?? '',
    country: dbUser.country ?? '',
    latitude: dbUser.latitude ? parseFloat(dbUser.latitude) : 0, // Parse string to number
    longitude: dbUser.longitude ? parseFloat(dbUser.longitude) : 0, // Parse string to number
  },
  contactInfo: {
    email: dbUser.email ?? '',
    phone: dbUser.phone ?? undefined, // Keep undefined if null/empty
    website: dbUser.website ?? undefined, // Keep undefined if null/empty
  },
  interests: dbUser.interests ?? [],
  createdAt: dbUser.createdAt ?? new Date(), // Provide default if null
  updatedAt: dbUser.updatedAt ?? new Date(), // Provide default if null
  // additionalInfo is not in the base schema, handle if needed
});

// Type for filtering options matching the database schema
export interface DbProfileFilterOptions {
    searchTerm?: string;
    location?: string;
    interests?: string[];
    sortBy?: keyof typeof users.$inferSelect | 'name'; // Allow 'name' alias for fullName
    sortOrder?: 'asc' | 'desc';
}

// Action to get profiles with filtering and sorting
export async function getProfiles(filters: DbProfileFilterOptions = {}): Promise<Profile[]> {
  console.log('Server Action: getProfiles called with filters:', filters);
  try {
    const queryFilters = [];
    if (filters.searchTerm) {
      const term = `%${filters.searchTerm}%`;
      queryFilters.push(
        or(
          ilike(users.fullName, term),
          ilike(users.description, term)
        )
      );
    }
    if (filters.location) {
      const loc = `%${filters.location}%`;
      queryFilters.push(
        or(
          ilike(users.city, loc),
          ilike(users.state, loc),
          ilike(users.country, loc)
        )
      );
    }
    if (filters.interests && filters.interests.length > 0) {
      // Use && operator for array containment (all interests must be present)
      queryFilters.push(sql`${users.interests} && ${filters.interests}`);
    }

    const whereCondition = queryFilters.length > 0 ? and(...queryFilters) : undefined;

    // Determine sorting column and order
    let orderByClause;
    const sortColumn = filters.sortBy === 'name' ? users.fullName : users[filters.sortBy as keyof typeof users.$inferSelect] || users.fullName;
    const sortDirection = filters.sortOrder === 'desc' ? desc : asc;
    orderByClause = sortDirection(sortColumn);


    const dbUsers = await db.select().from(users).where(whereCondition).orderBy(orderByClause);

    console.log(`Server Action: Found ${dbUsers.length} users.`);
    return dbUsers.map(mapDbUserToProfile);
  } catch (error) {
    console.error('Server Action Error (getProfiles):', error);
    // In a real app, you might want to throw a more specific error or return an empty array/error object
    throw new Error('Failed to fetch profiles.');
  }
}

// Action to get a single profile by ID
export async function getProfileById(id: string): Promise<Profile | null> {
  console.log(`Server Action: getProfileById called with id: ${id}`);
  const profileId = parseInt(id, 10);
  if (isNaN(profileId)) {
    console.error('Server Action Error (getProfileById): Invalid ID format');
    return null;
  }

  try {
    const result = await db.select().from(users).where(eq(users.id, profileId)).limit(1);
    if (result.length === 0) {
      console.log(`Server Action: Profile with ID ${id} not found.`);
      return null;
    }
    console.log(`Server Action: Found profile with ID ${id}.`);
    return mapDbUserToProfile(result[0]);
  } catch (error) {
    console.error(`Server Action Error (getProfileById ${id}):`, error);
    throw new Error('Failed to fetch profile.');
  }
}

// Action to create a new profile
export async function createProfile(formData: ProfileFormData): Promise<Profile> {
  console.log('Server Action: createProfile called');
  try {
    // Basic validation (can add more)
    if (!formData.name || !formData.description || !formData.address || !formData.contactInfo?.email) {
        throw new Error('Missing required fields for profile creation.');
    }

    const newUser = {
      fullName: formData.name,
      photo: formData.photo,
      description: formData.description,
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      zipCode: formData.address.zipCode,
      country: formData.address.country,
      latitude: formData.address.latitude.toString(),
      longitude: formData.address.longitude.toString(),
      email: formData.contactInfo.email,
      phone: formData.contactInfo.phone,
      website: formData.contactInfo.website,
      interests: formData.interests ?? [],
      // createdAt and updatedAt will use database defaults
    };

    const insertedResult = await db.insert(users).values(newUser).returning();

    if (insertedResult.length === 0) {
      throw new Error('Profile creation failed, no data returned.');
    }

    console.log('Server Action: Profile created successfully.');
    revalidatePath('/admin'); // Revalidate admin page cache
    revalidatePath('/profiles'); // Revalidate profiles list page cache
    return mapDbUserToProfile(insertedResult[0]);

  } catch (error) {
    console.error('Server Action Error (createProfile):', error);
    throw new Error('Failed to create profile.');
  }
}

// Action to update an existing profile
export async function updateProfile(id: string, formData: ProfileFormData): Promise<Profile> {
  console.log(`Server Action: updateProfile called for id: ${id}`);
  const profileId = parseInt(id, 10);
   if (isNaN(profileId)) {
    throw new Error('Invalid ID format for update.');
  }

  try {
     // Basic validation
    if (!formData.name || !formData.description || !formData.address || !formData.contactInfo?.email) {
        throw new Error('Missing required fields for profile update.');
    }

     const updatedUser = {
      fullName: formData.name,
      photo: formData.photo,
      description: formData.description,
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      zipCode: formData.address.zipCode,
      country: formData.address.country,
      latitude: formData.address.latitude.toString(),
      longitude: formData.address.longitude.toString(),
      email: formData.contactInfo.email,
      phone: formData.contactInfo.phone,
      website: formData.contactInfo.website,
      interests: formData.interests ?? [],
      updatedAt: new Date(), // Explicitly set updatedAt time
    };

    const updatedResult = await db.update(users)
      .set(updatedUser)
      .where(eq(users.id, profileId))
      .returning();

     if (updatedResult.length === 0) {
      throw new Error(`Profile update failed, profile with ID ${id} not found or no changes made.`);
    }

    console.log(`Server Action: Profile ${id} updated successfully.`);
    revalidatePath('/admin');
    revalidatePath('/profiles');
    revalidatePath(`/profiles/${id}`); // Revalidate specific profile page
    return mapDbUserToProfile(updatedResult[0]);

  } catch (error) {
    console.error(`Server Action Error (updateProfile ${id}):`, error);
    throw new Error('Failed to update profile.');
  }
}

// Action to delete a profile
export async function deleteProfile(id: string): Promise<{ success: boolean }> {
  console.log(`Server Action: deleteProfile called for id: ${id}`);
  const profileId = parseInt(id, 10);
   if (isNaN(profileId)) {
     console.error('Server Action Error (deleteProfile): Invalid ID format');
    return { success: false };
  }

  try {
    const deletedResult = await db.delete(users).where(eq(users.id, profileId)).returning({ deletedId: users.id });

    if (deletedResult.length === 0) {
       console.warn(`Server Action: Profile with ID ${id} not found for deletion.`);
       return { success: false }; // Or throw an error if preferred
    }

    console.log(`Server Action: Profile ${id} deleted successfully.`);
    revalidatePath('/admin');
    revalidatePath('/profiles');
    return { success: true };
  } catch (error) {
    console.error(`Server Action Error (deleteProfile ${id}):`, error);
    throw new Error('Failed to delete profile.');
  }
}

/**
 * Server Action: Get distinct filter options (locations, interests) from the database.
 */
export async function getFilterOptions(): Promise<{ locations: string[], interests: string[] }> {
    console.log("Server Action: getFilterOptions called");
    try {
        // Get distinct non-null locations
        const distinctLocationsResult = await db.selectDistinct({ location: users.location })
                                                .from(users)
                                                .where(isNotNull(users.location))
                                                .orderBy(asc(users.location));

        // Get distinct non-null interests (unnesting the array)
        // Alias the unnested column as 'interest'
        const distinctInterestsResult = await db.selectDistinct({
            interest: sql<string>`unnest(${users.interests}) AS interest`
        })
        .from(users)
        .where(sql`${users.interests} IS NOT NULL`) // Keep filtering out users with null interests array
        .orderBy(sql`interest`); // Order by the aliased column

        const locations = distinctLocationsResult.map(row => row.location).filter((loc): loc is string => loc !== null);
        // Ensure the mapping uses the correct alias 'interest'
        const interests = distinctInterestsResult.map(row => row.interest).filter((interest): interest is string => interest !== null);


        console.log("Server Action: Found filter options:", { locations: locations.length, interests: interests.length });
        return { locations, interests };
    } catch (error) {
        console.error('Server Action Error (getFilterOptions):', error);
        // Propagate a more specific error or handle it as needed
        throw new Error('Failed to fetch filter options.');
    }
} 