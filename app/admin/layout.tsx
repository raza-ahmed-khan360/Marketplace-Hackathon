'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdmin } from '../contexts/AdminContext';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, loading, adminLogout } = useAdmin();

  useEffect(() => {
    if (!loading && !isAdmin && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAdmin, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-scales-off-white flex items-center justify-center font-inter">
        <p className="text-gray-scales-dark-gray">Loading...</p>
      </div>
    );
  }

  if (!isAdmin && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-scales-off-white font-inter">
      {/* Admin Navigation */}
      <nav className="bg-gray-scales-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-semibold text-gray-scales-black">Admin Panel</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/admin/dashboard'
                      ? 'text-accents-dark-accents'
                      : 'text-gray-scales-dark-gray hover:text-accents-dark-accents'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/products"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/admin/products'
                      ? 'text-accents-dark-accents'
                      : 'text-gray-scales-dark-gray hover:text-accents-dark-accents'
                  }`}
                >
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/admin/orders'
                      ? 'text-accents-dark-accents'
                      : 'text-gray-scales-dark-gray hover:text-accents-dark-accents'
                  }`}
                >
                  Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={adminLogout}
                className="px-4 py-2 text-sm font-medium text-gray-scales-dark-gray hover:text-accents-dark-accents"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 