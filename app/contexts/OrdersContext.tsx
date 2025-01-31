'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { client } from '@/lib/sanity';

interface Order {
  _id: string;
  orderNumber: string;
}

interface OrdersContextProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrdersContext = createContext<OrdersContextProps | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    client.fetch('*[_type == "order"]').then((data) => {
      setOrders(data);
    });
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
