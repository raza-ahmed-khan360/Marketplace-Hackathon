import { atom, useAtom } from 'jotai';

type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

interface OrderStatusType {
  status: OrderStatus;
  estimatedDelivery: Date | null;
}

// Create a map to store order statuses for different orders
const orderStatusMapAtom = atom<Record<string, OrderStatusType>>({});

// Get status for specific order
const getOrderStatusAtom = atom(
  (get) => (orderId: string): OrderStatusType => {
    const statusMap = get(orderStatusMapAtom);
    return statusMap[orderId] || {
      status: 'Processing',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
  }
);

// Set status for specific order
const setOrderStatusAtom = atom(
  null,
  (get, set, { orderId, status }: { orderId: string; status: OrderStatusType }) => {
    const currentMap = get(orderStatusMapAtom);
    set(orderStatusMapAtom, {
      ...currentMap,
      [orderId]: status
    });
  }
);

/**
 * Custom hook to use order status
 */
export function useOrderStatus(orderId: string): OrderStatusType {
  const [getStatus] = useAtom(getOrderStatusAtom);
  return getStatus(orderId);
}