"use client";

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCar, FaCreditCard } from 'react-icons/fa';

const CarType = () => {
  type CarCategory = 'Economy' | 'Luxury' | 'SUV' | 'Electric';
  const [activeType, setActiveType] = useState<CarCategory>('Economy');

  const steps = [
    {
      icon: <FaMapMarkerAlt className="text-white w-10 h-10 p-2 bg-orange-600 rounded-full shadow-lg" />,
      title: "Choose a location",
      description: "See 3 popular places you want to visit",
    },
    {
      icon: <FaCar className="text-white w-10 h-10 p-2 bg-orange-600 rounded-full shadow-lg" />,
      title: "Pick a car",
      description: "Select from a wide range of cars available",
    },
    {
      icon: <FaCreditCard className="text-white w-10 h-10 p-2 bg-orange-600 rounded-full shadow-lg" />,
      title: "Confirm & Pay",
      description: "Securely complete your booking",
    },
  ];

  const carBrandsByType: Record<CarCategory, string[]> = {
    Economy: ["Toyota", "Honda", "Hyundai", "Kia", "Nissan"],
    Luxury: ["BMW", "Mercedes", "Audi", "Lexus", "Porsche"],
    SUV: ["Jeep", "Land Rover", "Ford", "Toyota"],
    Electric: ["Tesla", "Nissan", "BMW", "Audi"],
  };

  return (
    <div className="flex flex-col px-4 sm:px-8 py-16 gap-12">
      
      {/* Car Brands Section */}
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {Object.keys(carBrandsByType).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
                activeType === type ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {carBrandsByType[activeType].map((brand, index) => (
            <div
              key={index}
              className="px-6 py-4 border border-orange-600 rounded-md hover:scale-105 transform transition-all duration-300 cursor-pointer bg-white shadow-md"
            >
              <h2 className="font-bold text-xl sm:text-2xl text-gray-700">{brand}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="flex flex-col items-center text-center gap-4">
        <h1 className="text-orange-600 font-bold text-lg">HOW IT WORKS</h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
          AutoRentPro works in 3 easy steps
        </h2>

        <div className="flex flex-col md:flex-row flex-wrap gap-8 mt-8 justify-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-4 p-6">
              <p className="animate-bounce">{step.icon}</p>
              <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarType;
