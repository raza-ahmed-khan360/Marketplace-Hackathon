"use client";
import React, { useState } from "react";
import TopBar from "../../components/TopBar";
import Header from "../../components/Header";
import NavLinks from "../../components/Navlinks";
import { FiX } from "react-icons/fi";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky left-0 right-0 top-0 z-50 shadow-lg">
      <TopBar />

      <div className="bg-gray-scales-off-white">
        <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      {/* Mobile Overlay and Navigation Links */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } lg:static lg:block lg:bg-transparent`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`bg-white w-64 h-full p-6 transform transition-transform duration-300 ease-in-out lg:hidden lg:p-0 lg:bg-transparent lg:transform-none ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="lg:hidden absolute top-4 right-4 text-2xl text-gray-scales-black"
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
          >
            <FiX />
          </button>

          {/* Mobile NavLinks */}
          <div className="mt-16 lg:mt-0">
            <NavLinks />
          </div>
        </div>
      </div>

      {/* Desktop NavLinks */}
      <div className="hidden lg:block">
        <NavLinks />
      </div>
    </div>
  );
}
