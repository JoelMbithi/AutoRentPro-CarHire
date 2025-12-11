"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/shared/Components/Navbar";
import Footer from "@/app/shared/Components/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide footer for your agent pages
  const shouldHideFooter = pathname.startsWith("/features/Car-Agents/components/agents");

  return (
    <>
     {!shouldHideFooter && <Navbar />}
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
}
