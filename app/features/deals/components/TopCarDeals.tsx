"use client";

import React, { useState } from "react";
import {
  SiHonda,
  SiAudi,
  SiNissan,
  SiMazda,
  SiToyota,
  SiBmw,
  SiMercedes,
  SiVolkswagen,
  SiFord,
  SiHyundai,
  SiKia,
} from "react-icons/si";
import { FaCar } from "react-icons/fa";

const mainBrands = [
  { name: "Honda", icon: <SiHonda className="text-2xl" /> },
  { name: "Audi", icon: <SiAudi className="text-2xl" /> },
  { name: "Nissan", icon: <SiNissan className="text-2xl" /> },
  { name: "Mazda", icon: <SiMazda className="text-2xl" /> },
  { name: "Toyota", icon: <SiToyota className="text-2xl" /> },
];

const moreBrands = [
  { name: "BMW", icon: <SiBmw className="text-2xl" /> },
  { name: "Mercedes", icon: <SiMercedes className="text-2xl" /> },
  { name: "Volkswagen", icon: <SiVolkswagen className="text-2xl" /> },
  { name: "Ford", icon: <SiFord className="text-2xl" /> },
  { name: "Hyundai", icon: <SiHyundai className="text-2xl" /> },
  { name: "Kia", icon: <SiKia className="text-2xl" /> },
  { name: "Lexus", icon: <FaCar className="text-2xl" /> },
];

const TopCarDeals = () => {
  const [showMore, setShowMore] = useState(false);

  const displayedBrands = showMore
    ? [...mainBrands, ...moreBrands]
    : mainBrands;

  return (
    <div className="flex flex-col gap-6 px-8 py-10 items-center justify-center">
      <h1 className="text-orange-600 text-lg font-semibold tracking-wide">
        Top Gear
      </h1>
      <h2 className="text-3xl sm:text-4xl text-black font-bold text-center leading-tight">
        Explore Our Top Deals From <br /> Top-Rated Dealers
      </h2>

      <div className="flex flex-row gap-4 flex-wrap justify-center mt-4 transition-all">
        {displayedBrands.map((brand) => (
          <div
            key={brand.name}
            className="flex items-center gap-2 bg-gray-100 hover:bg-orange-600 
            shadow-md w-32 h-14 rounded-md border hover:border-orange-500 
            transition-all cursor-pointer hover:shadow-lg px-3 
            text-black hover:text-white"
          >
            <div className="flex items-center justify-center p-2">
              {brand.icon}
            </div>
            <h1 className="font-semibold text-sm">{brand.name}</h1>
          </div>
        ))}

        {/* Toggle More Button */}
        <div
          onClick={() => setShowMore(!showMore)}
          className="flex items-center justify-center gap-1 bg-orange-600 
          text-white shadow-md w-32 h-14 rounded-md cursor-pointer 
          hover:bg-orange-700 transition-all px-3"
        >
          <h1 className="text-sm font-semibold">
            {showMore ? "Show Less" : "Explore"}
          </h1>
          <span className="text-xl font-bold">{showMore ? "-" : "20+"}</span>
        </div>
      </div>
    </div>
  );
};

export default TopCarDeals;
