import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import WhatsapChart from "./WhatsApp/WhatsApp";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <span className="text-2xl font-black tracking-tight">
              <span className="text-gray-900">Auto</span>
              <span className="text-orange-600">Rent</span>
              <span className="text-gray-900">Pro</span>
              <span className="text-orange-600">.</span>
            </span>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Premium vehicles, transparent pricing, and seamless service — wherever
              your journey takes you.
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
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-orange-600 hover:text-white transition-all duration-200 text-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest">
              Company
            </h3>
            <div className="flex flex-col gap-2.5">
              {["Why AutoRentPro", "Our Story", "Investor Relations", "Press Center", "Advertise"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
            <WhatsapChart />
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest">
              Resources
            </h3>
            <div className="flex flex-col gap-2.5">
              {["Download", "Help Center", "Guides", "Developers", "Mechanics"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Extras + Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest">
              Extras
            </h3>
            <div className="flex flex-col gap-2.5 mb-2">
              {["Rental Deals", "Repair Shop", "View Booking", "Hire Companies", "New Offers"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest">
                Newsletter
              </h3>
              <p className="text-xs text-gray-400">
                Get exclusive deals in your inbox.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <button className="w-full bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-orange-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2025 AutoRentPro. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-gray-400 hover:text-orange-600 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;