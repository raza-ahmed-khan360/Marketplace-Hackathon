'use client';

import { CartProvider } from "./contexts/CartContext";
import NavBar from "./home/sections/NavBar";
import Footer from "./home/sections/Footer";
import { OrderStatusProvider } from './contexts/OrderStatusContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderStatusProvider>
      <CartProvider>
        <Toaster position="bottom-right" />
        <WishlistProvider>
          <CategoriesProvider>
            <ReviewsProvider>
              <NavBar />
              {children}
              <Footer />
            </ReviewsProvider>
          </CategoriesProvider>
        </WishlistProvider>
      </CartProvider>
    </OrderStatusProvider>
  );
} 