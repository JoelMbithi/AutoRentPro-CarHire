"use client";

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCar, FaCreditCard } from 'react-icons/fa';

type CarCategory = 'Economy' | 'Luxury' | 'SUV' | 'Electric';

const steps = [
  {
    icon: <FaMapMarkerAlt className="w-5 h-5" />,
    step: "01",
    title: "Choose a location",
    description: "Pick from our available locations across Kenya — city centre, airport, or doorstep delivery.",
  },
  {
    icon: <FaCar className="w-5 h-5" />,
    step: "02",
    title: "Pick your car",
    description: "Filter by category, brand, or budget. Every vehicle is verified and ready to go.",
  },
  {
    icon: <FaCreditCard className="w-5 h-5" />,
    step: "03",
    title: "Confirm & pay",
    description: "Secure checkout in under a minute. Instant confirmation, no hidden charges.",
  },
];

const carBrandsByType: Record<CarCategory, string[]> = {
  Economy:  ["Toyota", "Honda", "Hyundai", "Kia", "Nissan"],
  Luxury:   ["BMW", "Mercedes", "Audi", "Lexus", "Porsche"],
  SUV:      ["Jeep", "Land Rover", "Ford", "Toyota"],
  Electric: ["Tesla", "Nissan", "BMW", "Audi"],
};

const CATEGORIES = Object.keys(carBrandsByType) as CarCategory[];

const CarType = () => {
  const [activeType, setActiveType] = useState<CarCategory>('Economy');

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-16 py-16 gap-20 max-w-7xl mx-auto">

      {/* ── BRANDS SECTION ── */}
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="block w-8 h-px bg-orange-600" />
            <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">Browse by type</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Find the right <span className="text-orange-600">car</span> for you.
          </h2>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-5 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 border ${
                activeType === type
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-orange-400 hover:text-orange-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Brand cards */}
        <div className="flex flex-wrap gap-3">
          {carBrandsByType[activeType].map((brand, index) => (
            <div
              key={index}
              className="px-6 py-4 border border-gray-100 hover:border-orange-600 bg-white cursor-pointer transition-all duration-200 group"
            >
              <h2 className="font-bold text-lg text-gray-400 group-hover:text-gray-900 transition-colors duration-200">
                {brand}
              </h2>
              <span className="block w-0 group-hover:w-full h-px bg-orange-600 transition-all duration-300 mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS SECTION ── */}
      <div className="flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="block w-8 h-px bg-orange-600" />
            <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">How it works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Booked in <span className="text-orange-600">3 steps.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row gap-0 border border-gray-100">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col gap-4 p-8 border-b md:border-b-0 md:border-r border-gray-100 last:border-0 hover:bg-orange-50 transition-colors duration-200 group"
            >
              {/* step number + icon row */}
              <div className="flex items-center justify-between">
                <span className="text-4xl font-extrabold text-gray-300 group-hover:text-orange-600 transition-colors duration-200 leading-none">
                  {step.step}
                </span>
                <span className="text-orange-600 bg-orange-50 group-hover:bg-orange-100 p-3 transition-colors duration-200">
                  {step.icon}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CarType;