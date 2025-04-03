"use client";

import React from 'react';
import TestPage from '../components/TestPage';
import ErrorBoundary from '../components/ErrorBoundary';

export default function TestsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-4 px-2 bg-gray-800 text-white mb-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Application Tests</h1>
        </div>
      </div>
      <ErrorBoundary>
        <TestPage />
      </ErrorBoundary>
    </div>
  );
} 