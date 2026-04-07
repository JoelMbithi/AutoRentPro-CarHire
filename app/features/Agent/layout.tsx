"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/shared/Components/Navbar";
import Footer from "@/app/shared/Components/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  // Hide Navbar/Footer for agent pages
  const isAgentRoute = pathname.startsWith("/features/Agent");

  return (
    <>
      {!isAgentRoute && <Navbar />}
      {children}
      {!isAgentRoute && <Footer />}
    </>
  );
}
