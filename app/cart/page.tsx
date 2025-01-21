'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (!cart.items.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some items to your cart to get started!</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              {/* Product Image */}
              <div className="w-24 h-24 relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Item Total and Remove Button */}
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-2 text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
