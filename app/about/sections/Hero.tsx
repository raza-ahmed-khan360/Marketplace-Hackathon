import type { NextPage } from 'next';
import Image from "next/image";
import Link from "next/link";

const AboutHero:NextPage = () => {
  	return (
        <div className="w-auto flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8 px-6 sm:px-8 md:px-16 lg:px-24 py-8 lg:py-12 text-left text-[32px] text-white font-inter">
        {/* Content Section */}
        <div className="flex flex-col lg:h-[395px] justify-center items-start bg-teal w-full h-auto max-w-lg lg:max-w-xl p-6 lg:p-8 gap-4">
          <b className="text-[28px] lg:text-[32px]">About Us - Comforty</b>
          <div className="text-[16px] lg:text-[18px] leading-[1.5]">
            At Comforty, we believe that the right chair can transform your space and elevate your comfort. Specializing in ergonomic design, premium materials, and modern aesthetics, we craft chairs that seamlessly blend style with functionality.
          </div>
          <Link href="/products" className="mt-auto hover:underline no-underline bg-whitesmoke1 text-whitesmoke text-[16px] py-4 px-6 rounded">
            View collection
          </Link>
        </div>
      
        {/* Image Section */}
        <div className="max-w-lg lg:max-w-xl">
          <Image
            className="w-full h-auto object-cover rounded"
            width={619}
            height={478}
            alt="Comforty chair"
            src="/About/Image Block.png"
          />
        </div>
      </div>
      
  );
};

export default AboutHero;
