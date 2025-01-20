'use client';

import { createContext, useContext, ReactNode } from 'react';

type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

interface OrderStatusContextType {
  status: OrderStatus;
  estimatedDelivery: Date | null;
}

const OrderStatusContext = createContext<((orderId: string) => OrderStatusContextType) | null>(null);

export function OrderStatusProvider({ children }: { children: ReactNode }) {
  const getOrderStatus = (orderId: string): OrderStatusContextType => {
    // TODO: Replace with actual API call
    return {
      status: 'Processing',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
  };

  return (
    <OrderStatusContext.Provider value={getOrderStatus}>
      {children}
    </OrderStatusContext.Provider>
  );
}

export function useOrderStatus(orderId: string): OrderStatusContextType {
  const context = useContext(OrderStatusContext);
  if (!context) {
    throw new Error('useOrderStatus must be used within an OrderStatusProvider');
  }
  return context(orderId);
} 