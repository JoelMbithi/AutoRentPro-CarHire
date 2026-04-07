import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaChevronDown } from "react-icons/fa";
import WhatsapChart from "./WhatsApp/WhatsApp";

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 sm:border-none">
      <button
        onClick={() => setOpen((o) => !o)}
        className="sm:hidden w-full flex items-center justify-between py-3.5"
      >
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <FaChevronDown
          size={10}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <h3 className="hidden sm:block text-sm font-medium text-gray-700 mb-4">{title}</h3>

      <div className={`${open ? "block" : "hidden"} sm:block pb-4 sm:pb-0`}>
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 sm:py-14">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 sm:gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-4 pb-6 sm:pb-0 border-b border-gray-100 sm:border-none mb-2 sm:mb-0">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gray-900">Auto</span>
              <span className="text-orange-600">Rent</span>
              <span className="text-gray-900">Pro</span>
              <span className="text-orange-600">.</span>
            </span>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Premium vehicles, transparent pricing, and seamless service
              wherever your journey takes you.
            </p>
            <div className="flex gap-2">
              {[
                { icon: <FaFacebookF />, label: "Facebook" },
                { icon: <FaTwitter />, label: "Twitter" },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaLinkedinIn />, label: "LinkedIn" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-orange-600 hover:border-orange-300 transition-colors text-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <FooterSection title="Company">
            <div className="flex flex-col gap-2.5">
              {[
                "Why AutoRentPro",
                "Our Story",
                "Investor Relations",
                "Press Center",
                "Advertise",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="mt-2">
                <WhatsapChart />
              </div>
            </div>
          </FooterSection>

          {/* Resources */}
          <FooterSection title="Resources">
            <div className="flex flex-col gap-2.5">
              {[
                "Download",
                "Help Center",
                "Guides",
                "Developers",
                "Mechanics",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </FooterSection>

          {/* Extras + Newsletter */}
          <FooterSection title="Extras">
            <div className="flex flex-col gap-2.5 mb-4">
              {[
                "Rental Deals",
                "Repair Shop",
                "View Booking",
                "Hire Companies",
                "New Offers",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
              <h3 className="text-sm font-medium text-gray-700">Newsletter</h3>
              <p className="text-xs text-gray-400">
                Get exclusive deals in your inbox.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition"
              />
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 rounded transition-colors">
                Subscribe
              </button>
            </div>
          </FooterSection>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 mt-10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 order-2 sm:order-1">
            © 2025 AutoRentPro. All rights reserved.
          </p>
          <div className="flex gap-5 order-1 sm:order-2">
            {[
              { name: "Privacy", url: "/features/Privacy" },
              { name: "Terms", url: "/features/TermsAndCondition" },
              { name: "Cookies", url: "/cookies" },
              { name: "Sitemap", url: "/sitemap" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.url}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;