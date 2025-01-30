'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-scales-off-white py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-scales-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-lg text-gray-scales-dark-gray">Loading order confirmation...</p>
        </div>
      </div> 
    </div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams ? searchParams.get('orderId') : null;

  useEffect(() => {
    if (!orderId) {
      console.error('Order ID is missing');
      return;
    }
  }, [orderId]);

  if (!orderId) return null;

  return (
    <div className="min-h-screen bg-gray-scales-off-white py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-scales-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <circle
                className="opacity-25"
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M9 24l9 9 21-21"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-scales-black mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-scales-dark-gray mb-8">
            Thank you for your order. Your order number is #{orderId}
          </p>

          <div className="space-y-4">
            <Link
              href={`/my-orders?highlight=${orderId}`}
              className="inline-block w-full sm:w-auto px-6 py-3 bg-accents-accents text-white rounded-3xs hover:bg-accents-dark-accents transition-colors"
            >
              View Order Details
            </Link>
            
            <div>
              <Link
                href="/"
                className="inline-block text-accents-dark-accents hover:text-accents-accents"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 