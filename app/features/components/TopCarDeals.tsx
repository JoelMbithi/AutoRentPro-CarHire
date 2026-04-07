"use client";

import React, { useState } from "react";
import {
  SiHonda, SiAudi, SiNissan, SiMazda, SiToyota,
  SiBmw, SiVolkswagen, SiFord, SiHyundai, SiKia,
} from "react-icons/si";
import { TbBrandMercedes } from "react-icons/tb";
import { FaCar } from "react-icons/fa";

const mainBrands = [
  { name: "Toyota",   icon: <SiToyota   className="w-5 h-5" /> },
  { name: "Honda",    icon: <SiHonda    className="w-5 h-5" /> },
  { name: "BMW",      icon: <SiBmw      className="w-5 h-5" /> },
  { name: "Audi",     icon: <SiAudi     className="w-5 h-5" /> },
  { name: "Mercedes", icon: <TbBrandMercedes className="w-5 h-5" /> },
  { name: "Nissan",   icon: <SiNissan   className="w-5 h-5" /> },
];

const moreBrands = [
  { name: "Mazda",      icon: <SiMazda      className="w-5 h-5" /> },
  { name: "Volkswagen", icon: <SiVolkswagen className="w-5 h-5" /> },
  { name: "Ford",       icon: <SiFord       className="w-5 h-5" /> },
  { name: "Hyundai",    icon: <SiHyundai    className="w-5 h-5" /> },
  { name: "Kia",        icon: <SiKia        className="w-5 h-5" /> },
  { name: "Lexus",      icon: <FaCar        className="w-5 h-5" /> },
];

const TopCarDeals = () => {
  const [showMore, setShowMore] = useState(false);
  const [active, setActive]     = useState<string | null>(null);

  const displayed = showMore ? [...mainBrands, ...moreBrands] : mainBrands;

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-16 py-10 sm:py-16 gap-8 sm:gap-10 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center gap-3">
          <span className="block w-8 h-px bg-orange-600" />
          <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">
            Top Gear
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          Top deals from <span className="text-orange-600">top-rated</span> dealers.
        </h2>
        <p className="text-sm text-gray-400 max-w-md leading-relaxed">
          Browse by brand and find certified vehicles from dealers you can trust across Kenya.
        </p>
      </div>

      {/* ── Brand grid ── */}
      <div className="flex flex-col border border-gray-200">

        {/* Brand tiles — 3 cols on mobile, flexible on desktop */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap border-b border-gray-200">
          {displayed.map((brand) => (
            <button
              key={brand.name}
              onClick={() => setActive(n => n === brand.name ? null : brand.name)}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-3
                px-3 sm:px-6 py-4 sm:py-4
                border-b sm:border-b-0 border-r border-gray-200
                cursor-pointer transition-colors duration-200 group
                ${active === brand.name
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-white text-gray-400 hover:bg-orange-50 hover:text-gray-900"
                }`}
            >
              <span className={`transition-colors duration-200
                ${active === brand.name ? "text-white" : "text-orange-600 group-hover:text-orange-500"}`}>
                {brand.icon}
              </span>
              <span className={`text-xs sm:text-sm font-semibold transition-colors duration-200
                ${active === brand.name ? "text-white" : "text-gray-600 group-hover:text-gray-900"}`}>
                {brand.name}
              </span>
            </button>
          ))}
        </div>

        {/* ── Footer bar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
          <span className="text-sm text-gray-400">
            {active ? (
              <><span className="text-gray-700 font-semibold">{active}</span> — browse available listings</>
            ) : (
              "Select a brand to filter listings"
            )}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {active && (
              <button
                onClick={() => setActive(null)}
                className="text-xs text-gray-400 hover:text-orange-600 transition-colors underline underline-offset-2"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setShowMore(s => !s)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-2 transition-colors w-full sm:w-auto justify-center"
            >
              {showMore ? "Show less" : "Show all brands"}
              <span className="font-bold">{showMore ? "−" : "20+"}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TopCarDeals;