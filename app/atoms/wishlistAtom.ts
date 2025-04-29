import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Product } from '../../types';

// Create wishlist atom with localStorage persistence
const wishlistAtom = atomWithStorage<Product[]>('wishlist', []);

// Derived atoms for operations
const addToWishlistAtom = atom(
  null,
  (get, set, product: Product) => {
    const wishlist = get(wishlistAtom);
    if (!wishlist.some(item => item._id === product._id)) {
      set(wishlistAtom, [...wishlist, product]);
    }
  }
);

const removeFromWishlistAtom = atom(
  null,
  (get, set, productId: string) => {
    const wishlist = get(wishlistAtom);
    set(wishlistAtom, wishlist.filter(item => item._id !== productId));
  }
);

const clearWishlistAtom = atom(
  null,
  (get, set) => {
    set(wishlistAtom, []);
  }
);

const isInWishlistAtom = atom(
  (get) => (productId: string): boolean => {
    const wishlist = get(wishlistAtom);
    return wishlist.some(item => item._id === productId);
  }
);

/**
 * Custom hook to use wishlist functionality
 */
export function useWishlist() {
  const [wishlistItems] = useAtom(wishlistAtom);
  const [, addToWishlist] = useAtom(addToWishlistAtom);
  const [, removeFromWishlist] = useAtom(removeFromWishlistAtom);
  const [isInWishlist] = useAtom(isInWishlistAtom);
  const [, clearWishlist] = useAtom(clearWishlistAtom);

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist: (productId: string) => isInWishlist(productId),
    clearWishlist,
  };
}