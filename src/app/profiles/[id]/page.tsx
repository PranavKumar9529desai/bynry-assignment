"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileDetails from '../../components/ProfileDetails';
import MapView from '../../components/MapView';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorMessage from '../../components/ErrorMessage';
import ErrorBoundary from '../../components/ErrorBoundary';
import { Profile } from '../../types/profile';
import { getProfileById } from '../../actions/profileActions'; // Import server action

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params?.id as string; // Get ID from URL

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // Function to fetch profile data
    const fetchProfile = async () => {
      if (!profileId) {
        setError("Profile ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setProfile(null); // Clear previous profile data

      try {
        // Call the server action to get the profile by ID
        const foundProfile = await getProfileById(profileId);

        if (foundProfile) {
          setProfile(foundProfile);
        } else {
          setError(`Profile with ID "${profileId}" not found.`);
        }
      } catch (err: any) {
        console.error(`Error fetching profile ${profileId}:`, err);
        setError(err.message || 'Failed to load profile details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile(); // Execute the fetch function

  }, [profileId]); // Re-run effect if profileId changes

  const handleBack = () => {
    router.push('/profiles'); // Navigate back to the main profiles list
  };

  const handleShowMap = () => {
    setShowMap(prev => !prev); // Toggle map visibility
  };

  const handleRetry = () => {
     // Re-trigger the useEffect by potentially changing the dependency,
     // or just call the fetch function again if it's stable.
     // For simplicity, we can reload or re-initiate fetch here.
     setIsLoading(true);
     setError(null);
     // Re-call the effect's logic:
     const fetchProfileAgain = async () => {
        if (!profileId) {
            setError("Profile ID is missing."); setIsLoading(false); return;
        }
        try {
            const foundProfile = await getProfileById(profileId);
            if (foundProfile) setProfile(foundProfile);
            else setError(`Profile with ID "${profileId}" not found.`);
        } catch (err: any) { setError(err.message || 'Failed to load profile details.'); }
        finally { setIsLoading(false); }
     };
     fetchProfileAgain();
  };

  // Decide what to render based on state
  let content;
  if (isLoading) {
    content = <LoadingIndicator message="Loading profile..." />;
  } else if (error) {
    // Pass handleRetry to ErrorMessage
    content = <ErrorMessage error={error} onRetry={handleRetry} />;
  } else if (profile) {
    content = (
      <>
        <ProfileDetails
          profile={profile}
          onBack={handleBack}
          onShowMap={handleShowMap} // Pass handler to toggle map
        />
        {showMap && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Location: {profile.address.city}, {profile.address.state}
            </h2>
             {/* Ensure lat/lon are numbers before rendering MapView */}
             {typeof profile.address.latitude === 'number' && typeof profile.address.longitude === 'number' ? (
                <MapView profile={profile} height="400px" zoom={14} />
             ) : (
                <p className="text-red-500">Invalid location data for map.</p>
             )}
             <button
                onClick={handleShowMap} // Use the same handler to close/toggle
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
          </div>
        )}
      </>
    );
  } else {
    // This case should ideally be covered by the error state when profile is not found
    content = <p>Profile not available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
       {/* Consistent header */}
       <div className="py-4 px-2 bg-gray-800 text-white mb-6">
         <div className="container mx-auto flex justify-between items-center">
           <h1 className="text-2xl font-bold">Profile Details</h1>
           <button
             onClick={handleBack}
             className="text-sm bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded"
           >
             Back to Profiles
           </button>
         </div>
       </div>
      <div className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          {content}
        </ErrorBoundary>
      </div>
    </div>
  );
} 