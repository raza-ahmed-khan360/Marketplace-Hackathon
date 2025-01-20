'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Generate tracking ID function
const generateTrackingId = () => {
  const prefix = 'TRK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Update the input field styles in the form sections
const inputClasses = "w-full h-[46px] px-4 rounded-3xs bg-gray-scales-white border border-gray-scales-light-gray box-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accents-accents/20 focus:border-accents-accents hover:border-gray-scales-dark-gray placeholder:text-gray-scales-dark-gray/50";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotal, clearCart } = useCart();
  const { user, loading: userLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  // Check for authentication
  useEffect(() => {
    if (!userLoading && !user) {
      toast.error('Please sign in to continue with checkout');
      router.push('/auth?redirect=checkout');
    }
  }, [user, userLoading, router]);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const trackingId = generateTrackingId();
      
      // Store order details in session storage
      const orderDetails = {
        trackingId,
        items: cartItems,
        total: getTotal(),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode
        },
        orderDate: new Date().toISOString(),
        status: 'Processing',
        paymentMethod: 'Cash on Delivery',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      };

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store order timestamp and details
      sessionStorage.setItem('lastOrderTime', new Date().toISOString());
      sessionStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));

      toast.success('Order placed successfully!');
      clearCart();
      router.push('/order-confirmation');
    } catch (error) {
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="w-auto py-12 font-inter">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <p className="text-lg text-gray-scales-dark-gray">Your cart is empty</p>
            <button 
              onClick={() => router.push('/products')}
              className="px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="w-auto font-inter bg-gray-scales-off-white min-h-screen">
      <section className="w-auto py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl lg:text-[32px] font-semibold text-gray-scales-black mb-12">
            Checkout
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-gray-scales-white p-6 rounded-3xs border border-gray-scales-light-gray shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-scales-black mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-scales-white p-6 rounded-3xs border border-gray-scales-light-gray shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-scales-black mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your street address"
                        className={inputClasses}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter your city"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Enter your country"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="Enter postal code"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-gray-scales-white p-6 rounded-3xs border border-gray-scales-light-gray shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-scales-black mb-6">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-scales-light-gray rounded-3xs bg-gray-scales-off-white">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-accents-accents flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-accents-accents"></div>
                        </div>
                        <span className="font-medium text-gray-scales-black">Cash on Delivery</span>
                      </div>
                      <span className="text-sm text-gray-scales-dark-gray">Default</span>
                    </div>
                    <p className="text-sm text-gray-scales-dark-gray italic">
                      Note: Online payment options will be available in upcoming updates.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-gray-scales-white p-6 rounded-3xs border border-gray-scales-light-gray shadow-sm sticky top-4">
                <h2 className="text-xl font-semibold text-gray-scales-black mb-6">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
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
                        <h3 className="text-sm font-medium text-gray-scales-black">{item.title}</h3>
                        <p className="text-sm text-gray-scales-dark-gray">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-scales-black">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-scales-light-gray pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-scales-dark-gray">
                    <span>Subtotal</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-scales-dark-gray">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-scales-black pt-2">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full mt-6 px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs font-semibold transition-all ${
                    isSubmitting 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-accents-dark-accents'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 