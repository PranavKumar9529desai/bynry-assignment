// @ts-nocheck
"use client"; // Needs to be client for state, effects, interactions

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProfileList from "./ProfileList";
import AdvancedSearchFilters from "./AdvancedSearchFilters";
import ProfileStatistics from "./ProfileStatistics";
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import dynamic from 'next/dynamic';
import { Profile, ProfileFilterOptions } from "../types/profile";
import {
  getProfiles,
  getFilterOptions,
  DbProfileFilterOptions,
} from "../actions/profileActions";

// Dynamically import map components with ssr disabled
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <LoadingIndicator message="Loading map..." />
});

const MultiMapView = dynamic(() => import('./MultiMapView'), {
  ssr: false,
  loading: () => <LoadingIndicator message="Loading map..." />
});

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [mapProfileId, setMapProfileId] = useState<string | null>(null);
  const [showAllProfilesMap, setShowAllProfilesMap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, startFiltering] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [availableInterests, setAvailableInterests] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<DbProfileFilterOptions>(
    {}
  );

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profilesData, filterOptionsData] = await Promise.all([
        getProfiles(),
        getFilterOptions(),
      ]);
      setFilteredProfiles(profilesData);
      setAvailableInterests(filterOptionsData.interests);
      setAvailableLocations(filterOptionsData.locations);
    } catch (err: any) {
      console.error("Error loading initial data:", err);
      setError(err.message || "Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleFilterChange = useCallback((filters: ProfileFilterOptions) => {
    let dbSortBy: any;

    if (filters.sortBy === "address") {
      dbSortBy = "street";
    } else if (filters.sortBy === "name") {
      dbSortBy = "fullName";
    } else {
      dbSortBy = filters.sortBy;
    }

    const dbFilters: DbProfileFilterOptions = {
      searchTerm: filters.searchTerm,
      location: filters.location,
      interests: filters.interests,
      sortBy: dbSortBy,
      sortOrder: filters.sortOrder,
    };

    setCurrentFilters(dbFilters);

    startFiltering(async () => {
      setError(null);
      try {
        const results = await getProfiles(dbFilters);
        setFilteredProfiles(results);
      } catch (err: any) {
        console.error("Error applying filters:", err);
        setError(err.message || "Failed to apply filters.");
      }
    });
  }, []);

  const handleViewDetails = (profileId: string) => {
    router.push(`/profiles/${profileId}`);
  };

  const handleShowMap = (profileId: string) => {
    setMapProfileId(profileId);
    setShowAllProfilesMap(false);
  };

  const handleShowAllMaps = () => {
    setShowAllProfilesMap(true);
    setMapProfileId(null);
  };

  const handleRetry = () => {
    loadInitialData();
  };

  const mapProfile = mapProfileId
    ? filteredProfiles.find((p) => p.id === mapProfileId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <ErrorMessage error={error} onRetry={handleRetry} />}

      {isLoading ? (
        <LoadingIndicator message="Loading profiles..." />
      ) : (
        <>
          <div className="flex flex-col mb-6">
            <AdvancedSearchFilters
              onFilterChange={handleFilterChange}
              availableInterests={availableInterests}
              availableLocations={availableLocations}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleShowAllMaps}
                disabled={isFiltering}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                View All on Map ({filteredProfiles.length})
              </button>
            </div>
          </div>

          <ProfileStatistics profiles={filteredProfiles} />

          {mapProfile && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Map View: {mapProfile.name}
              </h2>
              {typeof mapProfile.address.latitude === "number" &&
              typeof mapProfile.address.longitude === "number" ? (
                <MapView profile={mapProfile} height="400px" zoom={14} />
              ) : (
                <p className="text-red-500">Invalid location data for map.</p>
              )}
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
                All Profiles Map View ({filteredProfiles.length})
              </h2>
              <MultiMapView
                profiles={filteredProfiles.filter(
                  (p) =>
                    typeof p.address.latitude === "number" &&
                    typeof p.address.longitude === "number"
                )}
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

          {isFiltering && <LoadingIndicator message="Applying filters..." />}

          {!isFiltering && (
            <ProfileList
              profiles={filteredProfiles}
              onViewDetails={handleViewDetails}
              onShowMap={handleShowMap}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
