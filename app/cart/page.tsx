'use client';

import type { NextPage } from 'next';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';

const CartPage: NextPage = () => {
    const router = useRouter();
    const { cartItems, removeItem, updateItem, getTotal } = useCart();

    const handleProceedToCheckout = () => {
        router.push('/checkout');
    };

    return (
        <div className="w-full h-auto py-10 overflow-hidden flex flex-col lg:flex-row justify-between items-start text-left text-mini text-gray-200 font-inter">
            {/* Left Section: Bag Items */}
            <div className="flex flex-col w-full lg:w-2/3 lg:mr-6">
                <div className="text-2xl md:text-4xl lg:text-[32px] font-semibold text-gray-scales-black px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
                    Bag ({cartItems.length} items)
                </div>
                
                {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col items-stretch justify-around text-gray-scales-dark-gray px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 mt-4">
                        <div className="bg-gray-scales-white p-6 rounded-3xs border border-gray-scales-light-gray flex flex-row items-start justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                            <div className="w-[150px] h-[150px] shrink-0 relative rounded-3xs overflow-hidden">
                                <Image 
                                    className="object-cover" 
                                    fill
                                    alt={item.title} 
                                    src={item.image} 
                                />
                            </div>
                            <div className="flex flex-col w-full gap-6">
                                <div className="flex flex-row items-start justify-between w-full">
                                    <div className="flex flex-col items-start justify-start">
                                        <div className="text-base font-medium text-gray-scales-black">
                                            {item.title}
                                        </div>
                                        <div className="flex flex-row items-center gap-4 mt-4">
                                            <div className="flex items-center border border-gray-scales-light-gray rounded-3xs">
                                                <button
                                                    onClick={() => updateItem(item.id, item.quantity - 1)}
                                                    className="px-3 py-1 border-r border-gray-scales-light-gray hover:bg-gray-scales-off-white transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 py-1">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateItem(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 border-l border-gray-scales-light-gray hover:bg-gray-scales-off-white transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-gray-scales-black">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-start justify-start gap-4 sm:gap-6 md:gap-8">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="flex items-center gap-2 text-status-error hover:opacity-80 transition-opacity"
                                    >
                                        <Image 
                                            className="w-6 h-6" 
                                            width={24} 
                                            height={24} 
                                            alt="Remove" 
                                            src="/cart/Frame (1).svg" 
                                        />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {cartItems.length === 0 && (
                    <div className="text-center py-8 text-gray-scales-dark-gray">
                        Your cart is empty
                    </div>
                )}
            </div>

            {/* Right Section: Summary */}
            {cartItems.length > 0 && (
                <div className="flex flex-col w-full lg:w-1/3 mt-6 lg:mt-0">
                    <div className="bg-gray-scales-white p-6 rounded-3xs border border-gray-scales-light-gray mx-4 sm:mx-8 md:mx-16 lg:mx-0">
                        <h2 className="text-xl font-semibold text-gray-scales-black mb-6">Summary</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-scales-dark-gray">Subtotal</span>
                                <span className="font-medium text-gray-scales-black">${getTotal().toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-scales-dark-gray">Estimated Delivery & Handling</span>
                                <span className="text-gray-scales-dark-gray">Free</span>
                            </div>

                            <div className="border-t border-gray-scales-light-gray pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-gray-scales-black">Total</span>
                                    <span className="text-lg font-semibold text-gray-scales-black">${getTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleProceedToCheckout}
                            className="w-full mt-6 px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors font-semibold"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
