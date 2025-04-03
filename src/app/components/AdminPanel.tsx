import React, { useState } from 'react';
import { Profile } from '../types/profile';
import ProfileForm from './ProfileForm';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';
import { mockProfiles } from '../data/mockProfiles';

const AdminPanel: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateProfile = () => {
    setIsCreatingProfile(true);
    setEditingProfileId(null);
  };

  const handleEditProfile = (profileId: string) => {
    setEditingProfileId(profileId);
    setIsCreatingProfile(false);
  };

  const handleDeleteConfirm = (profileId: string) => {
    setDeleteConfirmId(profileId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleDeleteProfile = (profileId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // Simulate API delay
      setTimeout(() => {
        const updatedProfiles = profiles.filter(profile => profile.id !== profileId);
        setProfiles(updatedProfiles);
        setDeleteConfirmId(null);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to delete profile. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // Simulate API delay
      setTimeout(() => {
        if (editingProfileId) {
          // Update existing profile
          const updatedProfiles = profiles.map(profile => 
            profile.id === editingProfileId 
              ? { 
                  ...formData, 
                  id: profile.id,
                  createdAt: profile.createdAt,
                  updatedAt: new Date()
                } 
              : profile
          );
          setProfiles(updatedProfiles);
          setEditingProfileId(null);
        } else {
          // Create new profile
          const newProfile: Profile = {
            ...formData,
            id: `${profiles.length + 1}`,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setProfiles([...profiles, newProfile]);
          setIsCreatingProfile(false);
        }
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setEditingProfileId(null);
    setIsCreatingProfile(false);
  };

  const profileToEdit = editingProfileId 
    ? profiles.find(p => p.id === editingProfileId) 
    : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        {!isCreatingProfile && !editingProfileId && (
          <button
            onClick={handleCreateProfile}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Create New Profile
          </button>
        )}
      </div>

      {error && <ErrorMessage error={error} />}

      {isLoading ? (
        <LoadingIndicator message="Processing..." />
      ) : (
        <>
          {isCreatingProfile || editingProfileId ? (
            <ProfileForm
              initialData={profileToEdit}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
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
                    {profiles.map(profile => (
                      <tr key={profile.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={profile.photo} 
                                alt={profile.name}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/40?text=NA';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{profile.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{profile.address.city}, {profile.address.state}</div>
                          <div className="text-sm text-gray-500">{profile.address.country}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {profile.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {profile.updatedAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {deleteConfirmId === profile.id ? (
                            <div className="flex justify-end items-center space-x-2">
                              <span className="text-red-600 mr-2">Confirm delete?</span>
                              <button 
                                onClick={() => handleDeleteProfile(profile.id)} 
                                className="text-red-600 hover:text-red-900"
                              >
                                Yes
                              </button>
                              <button 
                                onClick={handleCancelDelete} 
                                className="text-gray-600 hover:text-gray-900"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-4">
                              <button 
                                onClick={() => handleEditProfile(profile.id)} 
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteConfirm(profile.id)} 
                                className="text-red-600 hover:text-red-900"
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
