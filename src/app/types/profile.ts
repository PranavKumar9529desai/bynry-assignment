export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;  // Added for map functionality
  longitude: number; // Added for map functionality
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
}

export interface Profile {
  id: string;
  name: string;
  photo: string;
  description: string;
  address: Address; // Use the Address interface
  contactInfo?: ContactInfo; // Added optional contact info
  interests?: string[]; // Added optional interests array
  additionalInfo?: Record<string, any>; // Added for potential extra fields
  createdAt: Date;
  updatedAt: Date;
}

// Define the type for filter options used in search/filtering
export interface ProfileFilterOptions {
  searchTerm?: string;
  location?: string;
  interests?: string[];
  sortBy?: keyof Profile | 'name' | 'createdAt' | 'updatedAt'; // Allow sorting by common fields
  sortOrder?: 'asc' | 'desc';
}

// Define the type for the data structure used in the ProfileForm
// It includes all editable fields of a Profile
export type ProfileFormData = Omit<Profile, 'id' | 'createdAt' | 'updatedAt'> & {
  // Ensure nested objects are fully defined if needed,
  // but Omit usually handles this well for simple cases.
  // If Address or ContactInfo had non-optional fields that should be optional in the form,
  // you might need a more specific type definition here.
}; 