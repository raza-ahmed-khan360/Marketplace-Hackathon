'use client';

import { ReactNode } from 'react';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  isAdminOnly?: boolean;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  isAdminOnly = false,
}: DashboardLayoutProps) {
  const { user, loading } = useUser();
  const router = useRouter();

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-scales-off-white flex items-center justify-center">
        <p className="text-xl text-gray-scales-dark-gray">Loading...</p>
      </div>
    );
  }

  // Handle authentication
  if (!user) {
    router.push('/auth');
    return null;
  }

  // Handle admin-only access
  if (isAdminOnly && user.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-scales-off-white py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-scales-black">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-scales-dark-gray">{subtitle}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-scales-dark-gray">Welcome back,</p>
            <p className="text-lg font-semibold text-gray-scales-black">{user.name}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-scales-white rounded-lg shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
} 