import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
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

interface Cart {
  items: CartItem[];
}

// Create the cart atom with localStorage persistence
const baseCartAtom = atomWithStorage<Cart>('cart', { items: [] });

// Create derived atoms for cart operations
const addToCartAtom = atom(
  null,
  (get, set, item: CartItem) => {
    const cart = get(baseCartAtom);
    const existingItem = cart.items.find(i => i.id === item.id);
    
    const newCart = {
      items: existingItem
        ? cart.items.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...cart.items, { ...item, quantity: 1 }],
    };
    
    set(baseCartAtom, newCart);
    toast.success('Added to cart');
  }
);

const removeFromCartAtom = atom(
  null,
  (get, set, itemId: string) => {
    const cart = get(baseCartAtom);
    const newCart = {
      items: cart.items.filter(item => item.id !== itemId),
    };
    set(baseCartAtom, newCart);
    toast.success('Removed from cart');
  }
);

const updateQuantityAtom = atom(
  null,
  (get, set, { itemId, quantity }: { itemId: string; quantity: number }) => {
    if (quantity < 1) {
      set(removeFromCartAtom, itemId);
      return;
    }

    const cart = get(baseCartAtom);
    const newCart = {
      items: cart.items.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      ),
    };
    set(baseCartAtom, newCart);
  }
);

const clearCartAtom = atom(
  null,
  (get, set) => {
    set(baseCartAtom, { items: [] });
  }
);

const calculateTotalAtom = atom(
  (get) => {
    const cart = get(baseCartAtom);
    return Number(cart.items.reduce((total, item) => total + (item.price * item.quantity), 0));
  }
);

/**
 * Custom hook to use cart functionality
 */
export function useCart() {
  const [cart] = useAtom(baseCartAtom);
  const [, addToCart] = useAtom(addToCartAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [, updateQuantityAtom_] = useAtom(updateQuantityAtom);
  const updateQuantity = (itemId: string, quantity: number) => 
    updateQuantityAtom_({ itemId, quantity });
  const [, clearCart] = useAtom(clearCartAtom);
  const [total] = useAtom(calculateTotalAtom);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal: total,
  };
}