import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const Hero: NextPage = () => {
  return (
    <div className="w-full flex justify-center py-8 lg:py-0">
      <div className="container mx-auto px-4 lg:px-20 max-w-7xl">
        <div className="relative flex flex-col-reverse lg:flex-row items-center justify-around bg-gray-scales-off-white rounded-3xs lg:rounded-bl-[48px] overflow-hidden">
          {/* Text Content */}
          <div className="w-full font-inter lg:w-1/2 p-6 lg:p-12 text-center lg:text-left">
            {/* Welcome Text */}
            <div className="text-xs lg:text-sm tracking-widest uppercase mb-4 text-gray-scales-dark-gray">
              Welcome to chairy
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-scales-black leading-tight mb-6">
              Best Furniture<br />
              Collection for your<br />
              interior.
            </h1>

            {/* CTA Button */}
            <Link 
              href="/products" 
              className="inline-flex no-underline hover:underline items-center justify-center px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors"
            >
              <span className="mr-2 text-sm lg:text-base font-semibold">Shop Now</span>
              <Image
                className="w-5 h-5 lg:w-6 lg:h-6"
                width={24}
                height={24}
                alt="Right Arrow"
                src="/homepage/Hero/right-arrow.svg"
              />
            </Link>
          </div>

          {/* Product Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              className="w-64 md:w-96 lg:w-[434px] h-auto object-contain"
              width={434}
              height={584}
              alt="Product Image"
              src="/homepage/Hero/Hero.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
