'use client';
 
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  trackingId: string;
  orderDate: string;
  status: string;
  total: number;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  estimatedDelivery: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // In a real application, fetch orders from your backend
    const mockOrders = [
      {
        trackingId: 'TRK-001',
        orderDate: '2024-01-20T10:00:00Z',
        status: 'Processing',
        total: 299,
        items: [
          {
            id: '1',
            title: 'Modern Chair',
            price: 199,
            quantity: 1,
            image: '/products/chair1.jpg',
          },
        ],
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          postalCode: '10001',
        },
        estimatedDelivery: '2024-01-27T10:00:00Z',
      },
      // Add more mock orders...
    ];
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // In a real application, update status in your backend
      const updatedOrders = orders.map(order =>
        order.trackingId === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-scales-dark-gray">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-scales-black">Orders</h1>

      {/* Orders Table */}
      <div className="bg-gray-scales-white rounded-3xs shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-scales-light-gray">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-scales-light-gray">
              {orders.map((order) => (
                <tr key={order.trackingId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-scales-black">
                    {order.trackingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-scales-black">{order.customer.name}</div>
                    <div className="text-sm text-gray-scales-dark-gray">{order.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-scales-dark-gray">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.trackingId, e.target.value)}
                      className="text-sm rounded-full px-3 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-accents-accents/20"
                      style={{
                        backgroundColor:
                          order.status === 'Delivered'
                            ? 'rgb(220 252 231)'
                            : order.status === 'Processing'
                            ? 'rgb(254 249 195)'
                            : order.status === 'Shipped'
                            ? 'rgb(219 234 254)'
                            : 'rgb(254 226 226)',
                        color:
                          order.status === 'Delivered'
                            ? 'rgb(22 101 52)'
                            : order.status === 'Processing'
                            ? 'rgb(161 98 7)'
                            : order.status === 'Shipped'
                            ? 'rgb(29 78 216)'
                            : 'rgb(185 28 28)',
                      }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-scales-dark-gray">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-accents-accents hover:text-accents-dark-accents"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-scales-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-scales-white rounded-3xs p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-scales-black">
                Order Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-scales-dark-gray hover:text-gray-scales-black"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-scales-dark-gray mb-2">Order ID</h3>
                  <p className="text-sm text-gray-scales-black">{selectedOrder.trackingId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-scales-dark-gray mb-2">Order Date</h3>
                  <p className="text-sm text-gray-scales-black">
                    {new Date(selectedOrder.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-scales-dark-gray mb-2">Status</h3>
                  <p className="text-sm text-gray-scales-black">{selectedOrder.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-scales-dark-gray mb-2">
                    Estimated Delivery
                  </h3>
                  <p className="text-sm text-gray-scales-black">
                    {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-scales-dark-gray mb-2">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-scales-black">
                      {selectedOrder.customer.name}
                    </p>
                    <p className="text-sm text-gray-scales-dark-gray">
                      {selectedOrder.customer.email}
                    </p>
                    <p className="text-sm text-gray-scales-dark-gray">
                      {selectedOrder.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-scales-black">
                      {selectedOrder.customer.address}
                    </p>
                    <p className="text-sm text-gray-scales-dark-gray">
                      {selectedOrder.customer.city}, {selectedOrder.customer.country}
                    </p>
                    <p className="text-sm text-gray-scales-dark-gray">
                      {selectedOrder.customer.postalCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-scales-dark-gray mb-2">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 relative rounded-3xs overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-scales-black">{item.title}</h4>
                        <p className="text-sm text-gray-scales-dark-gray">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-scales-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-scales-light-gray pt-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-scales-dark-gray">Total</span>
                  <span className="text-sm font-semibold text-gray-scales-black">
                    ${selectedOrder.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 