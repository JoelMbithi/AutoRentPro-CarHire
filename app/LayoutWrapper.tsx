"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/shared/Components/Navbar";
import Footer from "@/app/shared/Components/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // Hide Navbar/Footer for multiple routes
  const shouldHideLayout =
    pathname.startsWith("/features/Admin") || // admin pages
    pathname.startsWith("/features/Car-Agents/components/agents"); // Car-Agents pages

  return (
    <>
    
      {!shouldHideLayout && <Navbar />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
}
