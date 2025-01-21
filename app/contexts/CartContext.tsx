'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

/**
 * Interface for cart item structure
 */
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

/**
 * Interface for cart context value
 */
interface CartContextType {
  cart: {
    items: CartItem[];
  };
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

// Create cart context with initial undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider Component
 * Manages cart state and provides cart operations through context
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<{ items: CartItem[] }>({ items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Adds an item to the cart
   * If item exists, increases quantity, otherwise adds new item
   * 
   * @param {CartItem} item - Item to add to cart
   */
  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(i => i.id === item.id);
      if (existingItem) {
        return {
          items: prevCart.items.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        items: [...prevCart.items, { ...item, quantity: 1 }],
      };
    });
    toast.success('Added to cart');
  };

  /**
   * Removes an item from the cart
   * 
   * @param {string} itemId - ID of item to remove
   */
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => ({
      items: prevCart.items.filter(item => item.id !== itemId),
    }));
    toast.success('Removed from cart');
  };

  /**
   * Updates the quantity of an item in the cart
   * Removes item if quantity is 0
   * 
   * @param {string} itemId - ID of item to update
   * @param {number} quantity - New quantity value
   */
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => ({
      items: prevCart.items.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      ),
    }));
  };

  /**
   * Clears all items from the cart
   */
  const clearCart = () => {
    setCart({ items: [] });
    localStorage.removeItem('cart');
  };

  /**
   * Calculates the total price of all items in the cart
   * 
   * @returns {number} Total price
   */
  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook to use cart context
 * Throws error if used outside of CartProvider
 * 
 * @returns {CartContextType} Cart context value
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 