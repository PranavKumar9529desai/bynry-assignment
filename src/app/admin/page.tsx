"use client";

import React from 'react';
import AdminPanel from '../components/AdminPanel';
import ErrorBoundary from '../components/ErrorBoundary';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-4 px-2 bg-gray-800 text-white mb-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Profile Management System</h1>
        </div>
      </div>
      <ErrorBoundary>
        <AdminPanel />
      </ErrorBoundary>
    </div>
  );
} 