import React, { useState, useEffect } from 'react';
import { Profile } from '../types/profile';

interface ProfileStatisticsProps {
  profiles: Profile[];
}

const ProfileStatistics: React.FC<ProfileStatisticsProps> = ({ profiles }) => {
  const [stats, setStats] = useState({
    totalProfiles: 0,
    profilesByCountry: {} as Record<string, number>,
    profilesByInterest: {} as Record<string, number>,
    newestProfile: null as Profile | null,
    oldestProfile: null as Profile | null
  });

  useEffect(() => {
    if (profiles.length === 0) return;

    // Calculate statistics
    const profilesByCountry: Record<string, number> = {};
    const profilesByInterest: Record<string, number> = {};
    
    // Find newest and oldest profiles
    let newest = profiles[0];
    let oldest = profiles[0];
    
    profiles.forEach(profile => {
      // Count by country
      const country = profile.address.country;
      profilesByCountry[country] = (profilesByCountry[country] || 0) + 1;
      
      // Count by interests
      profile.interests?.forEach(interest => {
        profilesByInterest[interest] = (profilesByInterest[interest] || 0) + 1;
      });
      
      // Update newest/oldest
      if (profile.createdAt > newest.createdAt) {
        newest = profile;
      }
      if (profile.createdAt < oldest.createdAt) {
        oldest = profile;
      }
    });
    
    setStats({
      totalProfiles: profiles.length,
      profilesByCountry,
      profilesByInterest,
      newestProfile: newest,
      oldestProfile: oldest
    });
  }, [profiles]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Total Profiles</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalProfiles}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800 mb-2">Countries</h3>
          <p className="text-3xl font-bold text-green-600">{Object.keys(stats.profilesByCountry).length}</p>
          <div className="mt-2 max-h-24 overflow-y-auto">
            {Object.entries(stats.profilesByCountry)
              .sort((a, b) => b[1] - a[1])
              .map(([country, count]) => (
                <div key={country} className="flex justify-between text-sm">
                  <span>{country}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-purple-800 mb-2">Top Interests</h3>
          <div className="max-h-32 overflow-y-auto">
            {Object.entries(stats.profilesByInterest)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([interest, count]) => (
                <div key={interest} className="flex justify-between text-sm mb-1">
                  <span>{interest}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {stats.newestProfile && (
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Newest Profile</h3>
            <div className="flex items-center">
              <img 
                src={stats.newestProfile.photo} 
                alt={stats.newestProfile.name} 
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/48?text=NA';
                }}
              />
              <div>
                <p className="font-medium">{stats.newestProfile.name}</p>
                <p className="text-sm text-gray-500">
                  Added {stats.newestProfile.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {stats.oldestProfile && (
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Oldest Profile</h3>
            <div className="flex items-center">
              <img 
                src={stats.oldestProfile.photo} 
                alt={stats.oldestProfile.name} 
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/48?text=NA';
                }}
              />
              <div>
                <p className="font-medium">{stats.oldestProfile.name}</p>
                <p className="text-sm text-gray-500">
                  Added {stats.oldestProfile.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStatistics;
