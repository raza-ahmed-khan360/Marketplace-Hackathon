'use client';
import Image from 'next/image';
import Link from 'next/link';

const TopBar = () => {
  return (
    <div className="w-full bg-gray-scales-black text-gray-scales-white font-inter">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Free Shipping Section */}
          <div className="flex items-center justify-center gap-2 opacity-70 text-center sm:text-left">
            <Image
              className="w-3 h-3 sm:w-4 sm:h-4"
              width={16}
              height={16}
              alt="check"
              src="/Header/check.svg"
            />
            <div className="text-xs sm:text-sm whitespace-nowrap">
              Free shipping on all orders over $50
            </div>
          </div>

          {/* Options Section */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 opacity-70">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <div className="text-xs sm:text-sm hover:underline">Eng</div>
              <Image
                className="w-2 h-1 sm:w-[7px] sm:h-[3.5px]"
                width={7}
                height={4}
                alt="dropdown"
                src="/Header/dropdown.svg"
              />
            </div>

            <Link href="/faq" className="text-xs sm:text-sm text-white hover:underline">
              Faqs
            </Link>

            <Link href="/contact" className="flex items-center gap-1.5 text-white group">
              <Image
                className="w-3 h-3 sm:w-4 sm:h-4 opacity-70"
                width={16}
                height={16}
                alt="alert"
                src="/Header/alert.svg"
              />
              <div className="text-xs sm:text-sm group-hover:underline">
                Need Help
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
