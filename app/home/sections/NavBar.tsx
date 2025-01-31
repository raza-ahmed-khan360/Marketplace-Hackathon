"use client";
import React, { useState } from "react";
import TopBar from "../../components/TopBar";
import Header from "../../components/Header";
import NavLinks from "../../components/Navlinks";
import { FiX } from "react-icons/fi";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky left-0 right-0 top-0 z-50 shadow-lg bg-white">
      <TopBar />

      <div className="bg-gray-scales-off-white w-full">
        <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } lg:hidden`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`fixed top-0 left-0 h-full w-[280px] bg-white p-6 transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 p-2 text-2xl text-gray-scales-black hover:bg-gray-100 rounded-full"
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
          >
            <FiX />
          </button>

          <div className="mt-16">
            <NavLinks isMobile={true} />
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block border-t border-gray-200">
        <NavLinks isMobile={false} />
      </div>
    </div>
  );
}
