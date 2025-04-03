import React from 'react';
import { Profile } from '../types/profile';

interface ProfileCardProps {
  profile: Profile;
  onViewDetails: (profileId: string) => void;
  onShowMap: (profileId: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onViewDetails, onShowMap }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={profile.photo} 
          alt={`${profile.name}'s photo`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{profile.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{profile.description}</p>
        <p className="text-gray-500 text-xs mb-4">
          {profile.address.city}, {profile.address.state}, {profile.address.country}
        </p>
        <div className="flex justify-between mt-4">
          <button 
            onClick={() => onViewDetails(profile.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
          <button 
            onClick={() => onShowMap(profile.id)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Show Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
