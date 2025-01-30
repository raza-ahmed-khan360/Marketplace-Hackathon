'use client';

import type { NextPage } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks: NextPage = () => {
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
      href: "/user-panel", 
      label: "My Orders",
      matches: ["/user-panel"]
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
    <nav className="w-full flex justify-between font-inter bg-gray-scales-white shadow-[0px_1px_0px_#e1e3e5]">
      <div className="container mx-auto px-4 lg:px-20 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-8 mb-4 lg:mb-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm no-underline capitalize transition-colors ${
                  isActiveLink(item)
                    ? "text-accents-dark-accents font-semibold"
                    : "text-gray-scales-dark-gray hover:text-accents-dark-accents"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-2">
            <span className="text-sm text-gray-scales-dark-gray capitalize">Need Help?</span>
            <span className="text-sm font-medium text-gray-scales-black capitalize">(808) 555-0111</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavLinks; 