'use client';

import type { NextPage } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
  isMobile: boolean;
}

const NavLinks: NextPage<NavLinksProps> = ({ isMobile }) => {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/", label: "Home" },
    { 
      href: "/products", 
      label: "Products",
      matches: ["/products", "/single-product"]
    },
    { href: "/contact", label: "Contact" },
    { 
      href: "/about", 
      label: "About Us",
      matches: ["/about"]
    },
    { 
      href: "/checkout", 
      label: "Checkout",
      matches: ["/checkout", "/order-confirmation"]
    }
  ];

  const isActiveLink = (item: { href: string, matches?: string[] }) => {
    if (item.matches) {
      return item.matches.some(path => pathname?.startsWith(path));
    }
    return pathname === item.href;
  };

  return (
    <nav className="w-full font-inter bg-gray-scales-white">
      <div className={`container mx-auto px-4 ${isMobile ? 'py-2' : 'py-4'}`}>
        <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row items-center justify-between'}`}>
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row items-center space-x-6 xl:space-x-8'}`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm no-underline capitalize transition-colors ${
                  isActiveLink(item)
                    ? "text-accents-dark-accents font-semibold"
                    : "text-gray-scales-dark-gray hover:text-accents-dark-accents"
                } ${isMobile ? 'py-2' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className={`flex items-center space-x-2 ${isMobile ? 'mt-6 pt-4 border-t' : ''}`}>
            <span className="text-sm text-gray-scales-dark-gray whitespace-nowrap">Need Help?</span>
            <span className="text-sm font-medium text-gray-scales-black whitespace-nowrap">(808) 555-0111</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavLinks;