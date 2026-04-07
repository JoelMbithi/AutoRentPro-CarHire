"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/shared/Components/Navbar";
import Footer from "@/app/shared/Components/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // Hide Navbar/Footer for multiple routes
  const shouldHideLayout =
  // admin pages
    pathname.startsWith("/features/Admin") ||
      // Car-Agents pages
    pathname.startsWith("/features/Car-Agents/components/agents") ||
      // Agent pages
    pathname.startsWith("/features/Agent");

  return (
    <>
    
      {!shouldHideLayout && <Navbar />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
}
