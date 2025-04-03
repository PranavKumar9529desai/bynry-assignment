'use client'; // Still needs to be a client component for state and interactions

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { Profile, ProfileFormData } from '../types/profile'; // Keep Profile type
import ProfileForm from './ProfileForm';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';
// Remove mockProfiles import
// import { mockProfiles } from '../data/mockProfiles';
import { getProfiles, createProfile, updateProfile, deleteProfile } from '../actions/profileActions'; // Import server actions

const AdminPanel: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  // Use useTransition for pending states during server action calls
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true); // For initial load
  const [error, setError] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null); // Store the whole profile being edited
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch initial profiles
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProfiles = await getProfiles(); // Call server action
        setProfiles(fetchedProfiles);
      } catch (err: any) {
        setError(err.message || 'Failed to load profiles.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []); // Empty dependency array means run once on mount

  const refreshProfiles = async () => {
      // Optionally add a loading state specific to refresh
      setError(null);
      try {
          const fetchedProfiles = await getProfiles();
          setProfiles(fetchedProfiles);
      } catch (err: any) {
          setError(err.message || 'Failed to refresh profiles.');
          console.error(err);
      }
  };


  const handleCreateProfile = () => {
    setIsCreatingProfile(true);
    setEditingProfile(null);
  };

  const handleEditProfile = (profile: Profile) => { // Pass the whole profile
    setEditingProfile(profile);
    setIsCreatingProfile(false);
  };

  const handleDeleteConfirm = (profileId: string) => {
    setDeleteConfirmId(profileId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleDeleteProfile = (profileId: string) => {
    setError(null);
    setDeleteConfirmId(null); // Close confirm dialog immediately

    startTransition(async () => {
      try {
        const result = await deleteProfile(profileId); // Call server action
        if (result.success) {
          // Re-fetch profiles after delete or filter locally
          // setProfiles(prev => prev.filter(p => p.id !== profileId));
          await refreshProfiles(); // Re-fetch to ensure consistency
        } else {
           setError('Failed to delete profile. Profile might not exist.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete profile. Please try again.');
        console.error(err);
      }
    });
  };

  const handleFormSubmit = (formData: ProfileFormData) => {
    setError(null);

    startTransition(async () => {
      try {
        if (editingProfile) {
          // Update existing profile
          await updateProfile(editingProfile.id, formData); // Call update action
          setEditingProfile(null);
        } else {
          // Create new profile
          await createProfile(formData); // Call create action
          setIsCreatingProfile(false);
        }
        // Re-fetch profiles after create/update
        await refreshProfiles();
      } catch (err: any) {
        setError(err.message || 'Failed to save profile. Please try again.');
        console.error(err);
      }
    });
  };

  const handleCancelForm = () => {
    setEditingProfile(null);
    setIsCreatingProfile(false);
    setError(null); // Clear errors when cancelling form
  };

  // const profileToEdit = editingProfileId
  //   ? profiles.find(p => p.id === editingProfileId)
  //   : undefined;
  // Use editingProfile state directly

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        {!isCreatingProfile && !editingProfile && (
          <button
            onClick={handleCreateProfile}
            disabled={isPending || isLoading} // Disable while loading/pending
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Create New Profile
          </button>
        )}
      </div>

      {error && <ErrorMessage error={error} />}

      {/* Show loading indicator for initial load OR pending server actions */}
      {isLoading ? (
         <LoadingIndicator message="Loading profiles..." />
      ) : isPending ? (
         <LoadingIndicator message="Processing..." />
      ) : (
        <>
          {isCreatingProfile || editingProfile ? (
            <ProfileForm
              // Pass the object matching ProfileFormData or undefined
              initialData={editingProfile ? {
                  // This object now correctly matches the expected ProfileFormData type
                  name: editingProfile.name,
                  photo: editingProfile.photo ?? '', // Ensure photo is string
                  description: editingProfile.description,
                  address: editingProfile.address,
                  contactInfo: {
                      email: editingProfile.contactInfo?.email ?? '',
                      // Provide defaults for potentially undefined optional fields
                      phone: editingProfile.contactInfo?.phone ?? '',
                      website: editingProfile.contactInfo?.website ?? '',
                  },
                  interests: editingProfile.interests ?? []
              } : undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* Table headers remain the same */}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profiles.length === 0 && !isLoading && (
                         <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                No profiles found.
                            </td>
                        </tr>
                    )}
                    {profiles.map(profile => (
                      <tr key={profile.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={profile.photo || 'https://via.placeholder.com/40?text=NA'} // Provide fallback
                                alt={profile.name}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/40?text=NA';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                              {/* Removed description preview for brevity, can be added back */}
                            </div>
                          </div>
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">{profile.contactInfo?.email}</div>
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Check if address exists before accessing properties */}
                          <div className="text-sm text-gray-900">{profile.address?.city}, {profile.address?.state}</div>
                          <div className="text-sm text-gray-500">{profile.address?.country}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Ensure createdAt is a Date object */}
                          {profile.createdAt instanceof Date ? profile.createdAt.toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Ensure updatedAt is a Date object */}
                          {profile.updatedAt instanceof Date ? profile.updatedAt.toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {deleteConfirmId === profile.id ? (
                            <div className="flex justify-end items-center space-x-2">
                              <span className="text-red-600 mr-2">Confirm delete?</span>
                              <button
                                onClick={() => handleDeleteProfile(profile.id)}
                                disabled={isPending} // Disable during pending delete
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                Yes
                              </button>
                              <button
                                onClick={handleCancelDelete}
                                disabled={isPending}
                                className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-4">
                              <Link href={`/profiles/${profile.id}`} passHref legacyBehavior>
                                <a className="text-blue-600 hover:text-blue-900" target="_blank" rel="noopener noreferrer">
                                  View
                                </a>
                              </Link>
                              <button
                                onClick={() => handleEditProfile(profile)} // Pass the whole profile
                                disabled={isPending} // Disable if another action is pending
                                className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(profile.id)}
                                disabled={isPending}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
