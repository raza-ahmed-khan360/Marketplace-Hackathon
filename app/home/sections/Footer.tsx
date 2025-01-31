import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
  
const Footer: NextPage = () => {
  return (
    <footer className="w-auto flex flex-col items-center bg-gray-scales-off-white py-10 px-4 sm:px-8 md:px-12 lg:px-20 font-inter">
      <div className="container w-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col items-start gap-4">
            <Link href={"/"} className="flex no-underline items-center gap-2">
              <Image
                src="/Footer/logo.svg"
                alt="Comforty Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div className="text-xl sm:text-[26px] font-semibold text-gray-scales-black">Comforty</div>
            </Link>
            <p className="text-sm text-gray-scales-dark-gray max-w-[250px]">
              Vivamus tristique odio sit amet velit semper, eu posuere turpis interdum. Cras egestas purus.
            </p>
            <div className="flex gap-6">
              {["twitter", "facebook", "instagram", "youtube"].map((social) => (
                <Link 
                  key={social}
                  className="text-gray-scales-dark-gray no-underline hover:opacity-75 transition-opacity" 
                  target="_blank" 
                  href={`/${social}.com`}
                >
                  <Image 
                    src={`/Footer/${social}.svg`} 
                    alt={social.charAt(0).toUpperCase() + social.slice(1)} 
                    width={26} 
                    height={26} 
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Category Links */}
          <div className="flex flex-col items-start gap-3">
            <h3 className="text-sm font-medium text-gray-scales-gray uppercase">Category</h3>
            <div className="space-y-2 flex flex-col text-sm text-gray-scales-dark-gray">
              {["Sofa", "Armchair", "Wing Chair", "Desk Chair", "Wooden Chair", "Park Bench"].map((category) => (
                <Link 
                  key={category}
                  href={"/products"} 
                  className="text-gray-scales-dark-gray no-underline hover:text-accents-dark-accents transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div className="flex flex-col items-start gap-3">
            <h3 className="text-sm font-medium text-gray-scales-gray uppercase">Support</h3>
            <div className="space-y-2 flex flex-col text-sm text-gray-scales-dark-gray">
              {[
                { label: "Help & Support", href: "/contact" },
                { label: "Terms & Conditions", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Help", href: "/faq" }
              ].map((link) => (
                <Link 
                  key={link.label}
                  className="text-gray-scales-dark-gray no-underline hover:text-accents-dark-accents transition-colors" 
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-sm font-medium text-gray-scales-gray uppercase">Newsletter</h3>
            <form className="w-full flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2 max-w-[400px] sm:max-w-none">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow rounded-3xs bg-gray-scales-white h-[46px] py-2 px-3 text-sm focus:outline-none focus:border-accents-dark-accents border border-gray-scales-light-gray font-inter text-gray-scales-dark-gray"
                />
                <button
                  type="submit"
                  className="bg-accents-accents text-gray-scales-white text-md font-medium py-3.5 px-6 cursor-pointer rounded-3xs hover:bg-accents-dark-accents transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-scales-dark-gray mt-2 max-w-[400px] sm:max-w-none">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt erat enim.
              </p>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-4 border-t border-gray-scales-light-gray flex flex-col sm:flex-row justify-between items-center text-sm text-gray-scales-dark-gray">
          <p className="mb-4 sm:mb-0 text-center sm:text-left">© 2021 - Blogy - Designed & Developed by Zakisoft</p>
          <div className="flex gap-4">
            {["mastercard", "paypal", "american-express", "visa-union"].map((payment) => (
              <Image 
                key={payment}
                src={`/Footer/${payment}.svg`} 
                alt={payment.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
                width={40} 
                height={16} 
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
