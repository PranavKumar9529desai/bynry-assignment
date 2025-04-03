import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import { Profile } from '../types/profile';

interface ProfileListProps {
  profiles: Profile[];
  onViewDetails: (profileId: string) => void;
  onShowMap: (profileId: string) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({ profiles, onViewDetails, onShowMap }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No profiles found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onViewDetails={onViewDetails}
              onShowMap={onShowMap}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileList;
