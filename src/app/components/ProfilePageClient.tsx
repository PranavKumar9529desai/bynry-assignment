"use client";

import React, { Suspense } from "react";
import ProfilePage from "./ProfilePage";
import LoadingIndicator from "./LoadingIndicator";

export default function ProfilePageClient() {
  // Add check for browser environment
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) {
    return <LoadingIndicator message="Loading..." />;
  }

  return (
    <Suspense fallback={<LoadingIndicator message="Loading profiles..." />}>
      <ProfilePage />
    </Suspense>
  );
}
