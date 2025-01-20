'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { client } from '../../lib/sanity';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  createdAt: string;
  status: string;
  total: number;
  items: Array<{
    _key: string;
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  inventory: number;
  status: 'active' | 'draft' | 'outOfStock';
  category: string;
  createdAt: string;
}

export default function AdminPanel() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/');
      return;
    }

    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersData = await client.fetch(`
        *[_type == "user"] | order(createdAt desc) {
          _id,
          name,
          email,
          role,
          isVerified,
          createdAt
        }
      `);
      setUsers(usersData);

      // Fetch orders
      const ordersData = await client.fetch(`
        *[_type == "order"] | order(createdAt desc) {
          _id,
          orderNumber,
          userId,
          "userName": user->name,
          createdAt,
          status,
          total,
          items[] {
            _key,
            productId,
            title,
            price,
            quantity
          }
        }
      `);
      setOrders(ordersData);

      // Fetch products
      const productsData = await client.fetch(`
        *[_type == "product"] | order(createdAt desc) {
          _id,
          title,
          price,
          inventory,
          status,
          category,
          createdAt
        }
      `);
      setProducts(productsData);

      // Calculate stats
      setStats({
        totalUsers: usersData.length,
        totalOrders: ordersData.length,
        totalProducts: productsData.length,
        totalRevenue: ordersData.reduce((sum: number, order: Order) => sum + order.total, 0),
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await client
        .patch(userId)
        .set({ role: newRole })
        .commit();
      
      toast.success('User role updated successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await client
        .patch(orderId)
        .set({ status: newStatus })
        .commit();
      
      toast.success('Order status updated successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-scales-off-white flex items-center justify-center">
        <p className="text-xl text-gray-scales-dark-gray">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-scales-off-white py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-scales-black">Admin Dashboard</h1>
          <div className="text-right">
            <p className="text-sm text-gray-scales-dark-gray">Welcome,</p>
            <p className="text-lg font-semibold text-gray-scales-black">{user.name}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-scales-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-scales-light-gray">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'dashboard'
                    ? 'border-accents-accents text-accents-accents'
                    : 'border-transparent text-gray-scales-dark-gray hover:text-gray-scales-black hover:border-gray-scales-light-gray'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'users'
                    ? 'border-accents-accents text-accents-accents'
                    : 'border-transparent text-gray-scales-dark-gray hover:text-gray-scales-black hover:border-gray-scales-light-gray'
                }`}
              >
                Users
              </button>
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
                onClick={() => setActiveTab('products')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'products'
                    ? 'border-accents-accents text-accents-accents'
                    : 'border-transparent text-gray-scales-dark-gray hover:text-gray-scales-black hover:border-gray-scales-light-gray'
                }`}
              >
                Products
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-scales-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-scales-black mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-accents-accents">{stats.totalUsers}</p>
            </div>
            <div className="bg-gray-scales-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-scales-black mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-accents-accents">{stats.totalOrders}</p>
            </div>
            <div className="bg-gray-scales-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-scales-black mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-accents-accents">{stats.totalProducts}</p>
            </div>
            <div className="bg-gray-scales-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-scales-black mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-accents-accents">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gray-scales-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-scales-light-gray">
                <thead className="bg-gray-scales-off-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-scales-white divide-y divide-gray-scales-light-gray">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-scales-black">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-scales-dark-gray">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="text-sm text-gray-scales-black border border-gray-scales-light-gray rounded-md px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-scales-dark-gray">
                        <button
                          onClick={() => router.push(`/admin/users/${user._id}`)}
                          className="text-accents-accents hover:text-accents-dark-accents"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-gray-scales-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-scales-light-gray">
                <thead className="bg-gray-scales-off-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Order #
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
                <tbody className="bg-gray-scales-white divide-y divide-gray-scales-light-gray">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-scales-black">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-scales-dark-gray">{order.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-scales-dark-gray">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="text-sm text-gray-scales-black border border-gray-scales-light-gray rounded-md px-2 py-1"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-scales-black">
                          ${order.total.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-scales-dark-gray">
                        <button
                          onClick={() => router.push(`/admin/orders/${order._id}`)}
                          className="text-accents-accents hover:text-accents-dark-accents"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-gray-scales-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-scales-light-gray">
              <button
                onClick={() => router.push('/admin/products/new')}
                className="px-4 py-2 bg-accents-accents text-gray-scales-white rounded-md hover:bg-accents-dark-accents transition-colors"
              >
                Add New Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-scales-light-gray">
                <thead className="bg-gray-scales-off-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Inventory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-scales-dark-gray uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-scales-white divide-y divide-gray-scales-light-gray">
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-scales-black">
                          {product.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-scales-dark-gray">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-scales-black">
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-scales-dark-gray">{product.inventory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-scales-dark-gray">
                        <button
                          onClick={() => router.push(`/admin/products/${product._id}`)}
                          className="text-accents-accents hover:text-accents-dark-accents mr-4"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 