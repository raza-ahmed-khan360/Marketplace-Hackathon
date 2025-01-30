'use client';
 
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import { HeartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '../contexts/WishlistContext';
import SearchBar from './SearchBar';

export default function Navigation() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { wishlistItems } = useWishlist();
  const totalWishlistItems = wishlistItems?.length || 0;

  const userMenuItems = [
    { label: 'My Orders', href: '/user-panel?tab=orders' },
    { label: 'Profile Settings', href: '/user-panel?tab=profile' },
    { label: 'Saved Addresses', href: '/user-panel?tab=addresses' },
    { label: 'Wishlist', href: '/user-panel?tab=wishlist' },
  ];

  const adminMenuItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Products', href: '/admin?tab=products' },
    { label: 'Orders', href: '/admin?tab=orders' },
    { label: 'Users', href: '/admin?tab=users' },
    { label: 'Categories', href: '/admin?tab=categories' },
  ];

  const isActive = (path: string) => {
    if (path.includes('?')) {
      const basePath = path.split('?')[0];
      if (pathname) {
        return pathname.startsWith(basePath);
      }
      return false;
    }
    return pathname === path;
  };

  return (
    <nav className="bg-gray-scales-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-accents-accents">Store</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/products"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/products')
                    ? 'text-accents-accents border-b-2 border-accents-accents'
                    : 'text-gray-scales-dark-gray hover:text-gray-scales-black'
                }`}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/categories')
                    ? 'text-accents-accents border-b-2 border-accents-accents'
                    : 'text-gray-scales-dark-gray hover:text-gray-scales-black'
                }`}
              >
                Categories
              </Link>
            </div>
          </div>

          {/* User Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link
              href="/cart"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/cart')
                  ? 'text-accents-accents bg-accents-accents/10'
                  : 'text-gray-scales-dark-gray hover:text-gray-scales-black'
              }`}
            >
              Cart
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-scales-dark-gray hover:text-gray-scales-black"
                >
                  <span>{user.name}</span>
                  <svg
                    className={`h-5 w-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-scales-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {user.role === 'admin' ? (
                        // Admin Menu Items
                        adminMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm ${
                              isActive(item.href)
                                ? 'text-accents-accents bg-accents-accents/10'
                                : 'text-gray-scales-dark-gray hover:text-gray-scales-black hover:bg-gray-scales-off-white'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))
                      ) : (
                        // User Menu Items
                        userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm ${
                              isActive(item.href)
                                ? 'text-accents-accents bg-accents-accents/10'
                                : 'text-gray-scales-dark-gray hover:text-gray-scales-black hover:bg-gray-scales-off-white'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          // Add logout functionality
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-scales-dark-gray hover:text-gray-scales-black hover:bg-gray-scales-off-white"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-scales-dark-gray hover:text-gray-scales-black"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-scales-dark-gray hover:text-gray-scales-black"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        {/* Search Section */}
        <div className="px-4 py-3 border-b border-gray-scales-light-gray">
          {isSearchVisible ? (
            <SearchBar onClose={() => setIsSearchVisible(false)} />
          ) : (
            <button
              onClick={() => setIsSearchVisible(true)}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-scales-dark-gray hover:text-gray-scales-black"
            >
              <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
              Search Products
            </button>
          )}
        </div>

        <div className="pt-2 pb-3 space-y-1">
          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-scales-dark-gray hover:text-gray-scales-black"
          >
            <HeartIcon className="w-5 h-5 mr-3" />
            Wishlist
            {totalWishlistItems > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                {totalWishlistItems}
              </span>
            )}
          </Link>

          {/* Existing Links */}
          <Link
            href="/products"
            className={`block px-3 py-2 text-base font-medium ${
              isActive('/products')
                ? 'text-accents-accents bg-accents-accents/10'
                : 'text-gray-scales-dark-gray hover:text-gray-scales-black'
            }`}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className={`block px-3 py-2 text-base font-medium ${
              isActive('/categories')
                ? 'text-accents-accents bg-accents-accents/10'
                : 'text-gray-scales-dark-gray hover:text-gray-scales-black'
            }`}
          >
            Categories
          </Link>
        </div>

        {user ? (
          <div className="pt-4 pb-3 border-t border-gray-scales-light-gray">
            <div className="px-4 py-2">
              <p className="text-base font-medium text-gray-scales-black">{user.name}</p>
              <p className="text-sm text-gray-scales-dark-gray">{user.email}</p>
            </div>
            <div className="mt-3 space-y-1">
              {user.role === 'admin'
                ? adminMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 text-base font-medium ${
                        isActive(item.href)
                          ? 'text-accents-accents bg-accents-accents/10'
                          : 'text-gray-scales-dark-gray hover:text-gray-scales-black'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))
                : userMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 text-base font-medium ${
                        isActive(item.href)
                          ? 'text-accents-accents bg-accents-accents/10'
                          : 'text-gray-scales-dark-gray hover:text-gray-scales-black'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  // Add logout functionality
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-scales-dark-gray hover:text-gray-scales-black"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-scales-light-gray">
            <div className="space-y-1">
              <Link
                href="/auth"
                className="block px-4 py-2 text-base font-medium text-gray-scales-dark-gray hover:text-gray-scales-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 