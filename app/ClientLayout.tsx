'use client';

import NavBar from "./home/sections/NavBar";
import Footer from "./home/sections/Footer";
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="bottom-right" />
      <NavBar />
      {children}
      <Footer />
    </>
  );
}