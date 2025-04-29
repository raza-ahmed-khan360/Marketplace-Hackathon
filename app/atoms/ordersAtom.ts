import { client } from '@/sanity/lib/client';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
}

// Base atom for orders
const ordersAtom = atom<Order[]>([]);

// Fetch orders atom
const fetchOrdersAtom = atom(
  null,
  async (get, set) => {
    const data = await client.fetch('*[_type == "order"]');
    set(ordersAtom, data);
  }
);

// Set orders atom
const setOrdersAtom = atom(
  null,
  (get, set, newOrders: Order[]) => {
    set(ordersAtom, newOrders);
  }
);

/**
 * Custom hook to use orders functionality
 */
export function useOrders() {
  const [orders] = useAtom(ordersAtom);
  const [, setOrders] = useAtom(setOrdersAtom);
  const [, fetchOrders] = useAtom(fetchOrdersAtom);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, setOrders };
}
