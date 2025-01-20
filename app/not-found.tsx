'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-52 w-full py-[110px] flex-col justify-center items-center gap-[45px] inline-flex">
      <div className="w-[960px] text-center text-[#333333] text-[64px] font-bold font-['Helvetica']">
        404 Not Found
      </div>
      <div className="w-[1080px] text-center text-[#4f4f4f] text-[27px] font-normal font-['Inter']">
        Oops sorry for your inconvenience
      </div>
      <Link 
        href="/"
        className="px-6 py-3.5 bg-[#029fae] no-underline rounded-lg justify-center items-center gap-5 inline-flex hover:opacity-90 transition-opacity"
      >
        <div className="text-center text-white text-base font-semibold font-['Inter'] capitalize leading-[17.60px]">
          Back to Home
        </div>
      </Link>
    </div>
  );
} 