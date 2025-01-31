'use client'
import { client } from '@/lib/sanity';
import React, { useEffect, useState } from 'react';

const ManageOrders = () => {
  interface Order {
    _id: string;
    orderNumber: string;
  }
  
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    client.fetch('*[_type == "order"]').then((data) => {
      setOrders(data);
    });
  }, []);

  return (
    <div>
      <h1>Manage Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>{order.orderNumber}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageOrders;
