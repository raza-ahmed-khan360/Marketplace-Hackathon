'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { client } from '@/lib/sanity';

interface Address {
  type: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, calculateTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (!cart.items.length) {
      router.push('/cart');
      return;
    }
  }, [cart.items.length, router]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId);
    const selected = savedAddresses.find(addr => addr.type === addressId);
    if (selected) {
      setFormData({
        firstName: selected.firstName,
        lastName: selected.lastName,
        email: '',
        phone: selected.phone,
        address: selected.address,
        city: selected.city,
        state: selected.state,
        postalCode: selected.postalCode,
        country: selected.country,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        _type: 'order',
        items: cart.items.map(item => ({
          _type: 'orderItem',
          product: { _type: 'reference', _ref: item.id },
          quantity: item.quantity,
          price: item.price
        })),
        total: calculateTotal(),
        status: 'processing',
        shippingAddress: {
          ...formData,
          type: selectedAddress || 'shipping'
        },
        createdAt: new Date().toISOString()
      };

      console.log('Order Data:', orderData); // Log order data

      // Save order to Sanity
      const createdOrder = await client.create(orderData);
      console.log('Created Order:', createdOrder); // Log created order

      // Clear cart and redirect to order confirmation
      clearCart();
      router.push(`/order-confirmation?orderId=${createdOrder._id}`);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {/* Order Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.title} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {savedAddresses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Saved Addresses</h3>
            <select
              value={selectedAddress}
              onChange={(e) => handleAddressSelect(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select an address</option>
              {savedAddresses.map((addr) => (
                <option key={addr.type} value={addr.type}>
                  {addr.type} - {addr.address}, {addr.city}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="p-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="p-2 border rounded md:col-span-2"
            required
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="State"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder="Postal Code"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Country"
            className="p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}