'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Interface for cart item structure
 */
interface CartItem {
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
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
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
  // Initialize cart state from localStorage if available
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Persist cart items to localStorage when they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Adds an item to the cart
   * If item exists, increases quantity, otherwise adds new item
   * 
   * @param {CartItem} newItem - Item to add to cart
   */
  const addItem = (newItem: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, newItem];
    });
  };

  /**
   * Removes an item from the cart
   * 
   * @param {string} itemId - ID of item to remove
   */
  const removeItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  /**
   * Updates the quantity of an item in the cart
   * Removes item if quantity is 0
   * 
   * @param {string} itemId - ID of item to update
   * @param {number} quantity - New quantity value
   */
  const updateItem = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  /**
   * Clears all items from the cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Calculates the total price of all items in the cart
   * 
   * @returns {number} Total price
   */
  const getTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateItem,
    clearCart,
    getTotal,
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