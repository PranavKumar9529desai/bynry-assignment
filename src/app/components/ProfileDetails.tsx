import React from 'react';
import { Profile } from '../types/profile';

interface ProfileDetailsProps {
  profile: Profile;
  onBack: () => void;
  onShowMap: (profileId: string) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile, onBack, onShowMap }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
          <div className="rounded-lg overflow-hidden shadow-md mb-4">
            <img 
              src={profile.photo} 
              alt={`${profile.name}'s photo`} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{profile.name}</h2>
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Location:</span> {profile.address.city}, {profile.address.state}, {profile.address.country}
            </p>
            {profile.contactInfo && (
              <>
                {profile.contactInfo.email && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Email:</span> {profile.contactInfo.email}
                  </p>
                )}
                {profile.contactInfo.phone && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Phone:</span> {profile.contactInfo.phone}
                  </p>
                )}
                {profile.contactInfo.website && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Website:</span>{' '}
                    <a 
                      href={profile.contactInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.contactInfo.website}
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
          <button 
            onClick={() => onShowMap(profile.id)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mb-4"
          >
            Show on Map
          </button>
        </div>
        
        <div className="md:w-2/3">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">About</h3>
            <p className="text-gray-600">{profile.description}</p>
          </div>
          
          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {profile.additionalInfo && Object.keys(profile.additionalInfo).length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(profile.additionalInfo).map(([key, value], index) => (
                  <div key={index} className="mb-2">
                    <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Address</h3>
            <p className="text-gray-600">
              {profile.address.street}<br />
              {profile.address.city}, {profile.address.state} {profile.address.zipCode}<br />
              {profile.address.country}
            </p>
          </div>
          
          <div className="text-gray-500 text-sm mt-8">
            <p>Profile created: {profile.createdAt.toLocaleDateString()}</p>
            <p>Last updated: {profile.updatedAt.toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t pt-4">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Profiles
        </button>
      </div>
    </div>
  );
};

export default ProfileDetails;
