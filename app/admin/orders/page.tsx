'use client'
import { client } from '@/lib/sanity';
import React, { useEffect, useState } from 'react';

const ManageOrders = () => {
  interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
  }
  
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    client.fetch('*[_type == "order"]').then((data) => {
      setOrders(data);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order Number</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">${order.total}</td>
                <td className="border px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
