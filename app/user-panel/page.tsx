'use client'; 

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import { client } from '../../lib/sanity';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: Array<{
    _key: string;
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export default function UserPanel() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-scales-off-white flex items-center justify-center">
      <p className="text-xl text-gray-scales-dark-gray">Loading user panel...</p>
    </div>}>
      <UserPanelContent />
    </Suspense>
  );
}

function UserPanelContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const highlightedOrderId = searchParams ? searchParams.get('highlight') : null;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    if (highlightedOrderId) {
      const element = document.getElementById(`order-${highlightedOrderId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('highlight-animation');
      }
    }
  }, [highlightedOrderId, orders]);

  const fetchOrders = async () => {
    try {
      const result = await client.fetch(`
        *[_type == "order" && userId == $userId] | order(createdAt desc) {
          _id,
          orderNumber,
          createdAt,
          status,
          total,
          items[] {
            _key,
            productId,
            title,
            price,
            quantity,
            image
          },
          shippingAddress
        }
      `, { userId: user?._id });
      setOrders(result);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-scales-off-white flex items-center justify-center">
        <p className="text-xl text-gray-scales-dark-gray">Please log in to access your account</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-scales-off-white py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-scales-black">My Account</h1>
          <div className="text-right">
            <p className="text-sm text-gray-scales-dark-gray">Welcome back,</p>
            <p className="text-lg font-semibold text-gray-scales-black">{user.name}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-scales-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-scales-light-gray">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'orders'
                    ? 'border-accents-accents text-accents-accents'
                    : 'border-transparent text-gray-scales-dark-gray hover:text-gray-scales-black hover:border-gray-scales-light-gray'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-accents-accents text-accents-accents'
                    : 'border-transparent text-gray-scales-dark-gray hover:text-gray-scales-black hover:border-gray-scales-light-gray'
                }`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'addresses'
                    ? 'border-accents-accents text-accents-accents'
                    : 'border-transparent text-gray-scales-dark-gray hover:text-gray-scales-black hover:border-gray-scales-light-gray'
                }`}
              >
                Addresses
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'orders' && (
          <>
            {loading ? (
              <div className="flex justify-center">
                <p className="text-gray-scales-dark-gray">Loading...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-gray-scales-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-scales-dark-gray">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    id={`order-${order._id}`}
                    className={`bg-gray-scales-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
                      highlightedOrderId === order._id ? 'ring-2 ring-accents-accents' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-scales-black mb-2">
                            Order #{order.orderNumber}
                          </h2>
                          <p className="text-sm text-gray-scales-dark-gray">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-scales-light-gray -mx-6 px-6 py-4">
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item._key} className="flex items-center">
                              <div className="h-20 w-20 flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-20 w-20 rounded-lg object-cover"
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <h3 className="text-sm font-medium text-gray-scales-black">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-scales-dark-gray">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="text-sm font-medium text-gray-scales-black">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-scales-light-gray -mx-6 px-6 pt-4">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-scales-dark-gray">
                            <p>
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                            </p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-scales-dark-gray">Total</p>
                            <p className="text-lg font-semibold text-gray-scales-black">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <div className="bg-gray-scales-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-scales-black mb-6">Profile Settings</h2>
            {/* Profile settings form will go here */}
            <p className="text-gray-scales-dark-gray">Profile settings coming soon...</p>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="bg-gray-scales-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-scales-black mb-6">Saved Addresses</h2>
            {/* Addresses management will go here */}
            <p className="text-gray-scales-dark-gray">Address management coming soon...</p>
          </div>
        )}
      </div>
      {highlightedOrderId && <div>Highlighted Order ID: {highlightedOrderId}</div>}
    </div>
  );
} 