'use client';
 
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import SearchBar from './SearchBar';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

/**
 * Header Component Props
 * @property {Function} onToggleMenu - Callback function to toggle mobile menu visibility
 */
interface HeaderProps {
  onToggleMenu: () => void;
}

/**
 * Header Component
 * Main navigation header of the application featuring logo, search, and cart
 * 
 * @param {HeaderProps} props - Component props
 * @returns {JSX.Element} Header with responsive navigation elements
 */
const Header: NextPage<HeaderProps> = ({ onToggleMenu }) => {
  const { cart } = useCart();
  const { wishlistItems } = useWishlist();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  
  // Calculate total items in cart
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistItems = wishlistItems?.length || 0;

  return (
    <header className="w-auto font-inter bg-gray-scales-off-white py-3 px-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Image
              className="w-8 sm:w-10 h-8 sm:h-10"
              width={40}
              height={40}
              alt="Comforty Logo"
              src="/Header/logo.svg"
            />
            <span className="text-lg sm:text-xl text-gray-scales-black font-medium">
              Comforty
            </span>
          </Link>

          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 text-2xl text-gray-scales-black hover:bg-gray-100 rounded-lg"
            onClick={onToggleMenu}
            aria-label="Toggle Menu"
          >
            <FiMenu />
          </button>
        </div>

        {/* Search and Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:block flex-grow max-w-md">
            <SearchBar />
          </div>

          <Link href="/wishlist" className="hidden sm:flex items-center no-underline">
            <div className="relative flex items-center rounded-lg bg-gray-scales-white py-2 px-3 lg:py-[11px] lg:px-4 gap-2 lg:gap-3 shadow-md hover:scale-105 transition-transform">
              {/* Wishlist Icon */}
              <HeartIcon className="w-5 lg:w-[22px] h-5 lg:h-[22px] text-gray-scales-black" />
              <span className="hidden lg:inline text-xs lg:text-sm font-medium capitalize">
                Wishlist
              </span>
              
              {/* Animated Wishlist Item Count Badge */}
              <AnimatePresence>
                {totalWishlistItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="relative w-4 lg:w-5 h-4 lg:h-5"
                  >
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-red-500"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                    <motion.span 
                      className="absolute inset-0 flex items-center justify-center text-[8px] lg:text-[10px] text-gray-scales-white font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {totalWishlistItems}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Link>

          <Link href="/cart" className="flex items-center no-underline">
            <div className="relative flex items-center rounded-lg bg-gray-scales-white py-2 px-3 lg:py-[11px] lg:px-4 gap-2 lg:gap-3 shadow-md hover:scale-105 transition-transform">
              {/* Cart Icon */}
              <ShoppingCartIcon className="w-5 lg:w-[22px] h-5 lg:h-[22px] text-gray-scales-black" />
              <span className="hidden lg:inline text-xs lg:text-sm font-medium capitalize">
                Cart
              </span>
              
              {/* Animated Cart Item Count Badge */}
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="relative w-4 lg:w-5 h-4 lg:h-5"
                  >
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-accents-dark-accents"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                    <motion.span 
                      className="absolute inset-0 flex items-center justify-center text-[8px] lg:text-[10px] text-gray-scales-white font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {totalItems}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
