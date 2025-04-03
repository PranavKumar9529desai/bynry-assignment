import React, { useState, useEffect } from 'react';
import ProfileList from './ProfileList';
import ProfileDetails from './ProfileDetails';
import AdvancedSearchFilters from './AdvancedSearchFilters';
import ProfileStatistics from './ProfileStatistics';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';
import MapView from './MapView';
import MultiMapView from './MultiMapView';
import { Profile, ProfileFilterOptions } from '../types/profile';
import { mockProfiles, filterProfiles, sortProfiles } from '../data/mockProfiles';

const ProfilePage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [mapProfileId, setMapProfileId] = useState<string | null>(null);
  const [showAllProfilesMap, setShowAllProfilesMap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableInterests, setAvailableInterests] = useState<string[]>([]);

  // Simulate loading profiles from an API
  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set profiles from mock data
        setProfiles(mockProfiles);
        setFilteredProfiles(mockProfiles);
        
        // Extract unique interests for filters
        const interests = new Set<string>();
        mockProfiles.forEach(profile => {
          profile.interests?.forEach(interest => interests.add(interest));
        });
        setAvailableInterests(Array.from(interests));
        
      } catch (err) {
        setError('Failed to load profiles. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfiles();
  }, []);

  const handleFilterChange = (filters: ProfileFilterOptions) => {
    let result = [...profiles];
    
    // Apply text search and location filters
    result = filterProfiles(
      result, 
      filters.searchTerm, 
      filters.location || '', 
      filters.interests || []
    );
    
    // Apply sorting
    if (filters.sortBy) {
      result = sortProfiles(
        result,
        filters.sortBy,
        filters.sortOrder || 'asc'
      );
    }
    
    setFilteredProfiles(result);
  };

  const handleViewDetails = (profileId: string) => {
    setSelectedProfileId(profileId);
    setMapProfileId(null);
    setShowAllProfilesMap(false);
  };

  const handleShowMap = (profileId: string) => {
    setMapProfileId(profileId);
    setShowAllProfilesMap(false);
  };

  const handleShowAllMaps = () => {
    setShowAllProfilesMap(true);
    setMapProfileId(null);
  };

  const handleBackToProfiles = () => {
    setSelectedProfileId(null);
    setMapProfileId(null);
    setShowAllProfilesMap(false);
  };

  const handleRetry = () => {
    // Reset error state and trigger profile reload
    setError(null);
    setProfiles([]);
    setFilteredProfiles([]);
    setIsLoading(true);
    
    // Simulate API delay and reload
    setTimeout(() => {
      setProfiles(mockProfiles);
      setFilteredProfiles(mockProfiles);
      setIsLoading(false);
    }, 1000);
  };

  const selectedProfile = selectedProfileId 
    ? profiles.find(p => p.id === selectedProfileId) 
    : null;

  const mapProfile = mapProfileId
    ? profiles.find(p => p.id === mapProfileId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile Directory</h1>
      
      {error && <ErrorMessage error={error} onRetry={handleRetry} />}
      
      {isLoading ? (
        <LoadingIndicator message="Loading profiles..." />
      ) : (
        <>
          {!selectedProfile ? (
            <>
              <div className="flex flex-col mb-6">
                <AdvancedSearchFilters 
                  onFilterChange={handleFilterChange}
                  availableInterests={availableInterests}
                  availableLocations={Array.from(new Set(profiles.map(p => p.address.city)))}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleShowAllMaps}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    View All on Map
                  </button>
                </div>
              </div>
              
              <ProfileStatistics profiles={filteredProfiles} />
              
              {mapProfile && (
                <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Map View: {mapProfile.name}
                  </h2>
                  <MapView profile={mapProfile} height="400px" zoom={14} />
                  <button
                    onClick={() => setMapProfileId(null)}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Close Map
                  </button>
                </div>
              )}
              
              {showAllProfilesMap && (
                <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    All Profiles Map View
                  </h2>
                  <MultiMapView 
                    profiles={filteredProfiles} 
                    height="500px" 
                    zoom={5}
                    onProfileSelect={handleViewDetails}
                  />
                  <button
                    onClick={() => setShowAllProfilesMap(false)}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Close Map
                  </button>
                </div>
              )}
              
              <ProfileList 
                profiles={filteredProfiles}
                onViewDetails={handleViewDetails}
                onShowMap={handleShowMap}
              />
            </>
          ) : (
            <div>
              <button 
                onClick={handleBackToProfiles}
                className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Profiles
              </button>
              
              <ProfileDetails 
                profile={selectedProfile}
                onBack={handleBackToProfiles}
                onShowMap={handleShowMap}
              />
              
              {mapProfileId === selectedProfile.id && (
                <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Location: {selectedProfile.address.city}, {selectedProfile.address.state}
                  </h2>
                  <MapView profile={selectedProfile} height="400px" zoom={14} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
