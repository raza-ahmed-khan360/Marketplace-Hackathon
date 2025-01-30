'use client';
import Image from 'next/image';
import Link from 'next/link';

const TopBar = () => {
  return (
    <div className="w-full flex justify-around bg-gray-scales-black text-gray-scales-white font-inter">
      <div className="container mx-auto px-4 lg:px-20 py-2 lg:py-3.5">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Free Shipping Section */}
          <div className="flex items-center justify-center lg:justify-start gap-2 opacity-70 mb-2 lg:mb-0">
            <Image
              className="w-3 h-3 lg:w-4 lg:h-4"
              width={16}
              height={16}
              alt="check"
              src="/Header/check.svg"
            />
            <div className="text-xs lg:text-sm leading-tight capitalize">
              Free shipping on all orders over $50
            </div>
          </div>

          {/* Options Section */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 opacity-70 text-center">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 cursor-pointer group">
              <div className="text-xs lg:text-sm leading-tight group-hover:underline">
                Eng
              </div>
              <Image
                className="w-2 h-1 lg:w-[7px] lg:h-[3.5px]"
                width={7}
                height={4}
                alt="dropdown"
                src="/Header/dropdown.svg"
              />
            </div>

            {/* FAQ Link */}
            <Link
              href="/faq"
              className="text-xs no-underline lg:text-sm text-white hover:underline leading-tight"
            >
              Faqs
            </Link>

            {/* Need Help Section */}
            <Link 
              href="/contact" 
              className="flex no-underline hover:underline items-center gap-1.5 text-white group"
            >
              <Image
                className="w-3 h-3 lg:w-4 lg:h-4 opacity-70"
                width={16}
                height={16}
                alt="alert"
                src="/Header/alert.svg"
              />
              <div className="text-xs lg:text-sm leading-tight group-hover:underline">
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
