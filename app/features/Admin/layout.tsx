"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/shared/Components/Navbar";
import Footer from "@/app/shared/Components/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // Hide Navbar/Footer for admin pages
  const isAdminRoute = pathname.startsWith("/features/Admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}
