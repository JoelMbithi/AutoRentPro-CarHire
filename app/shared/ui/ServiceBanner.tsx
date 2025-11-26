"use client";

import Image from 'next/image';
import React from 'react';
import { FaTags, FaDollarSign, FaHeadset } from 'react-icons/fa';

const services = [
  {
    icon: <FaTags className="text-orange-600 w-10 h-10 p-2 rounded-full bg-orange-100" />,
    title: "Deals for Every Budget",
    description: "Incredible prices on car packages worldwide.",
  },
  {
    icon: <FaDollarSign className="text-orange-600 w-10 h-10 p-2 rounded-full bg-orange-100" />,
    title: "Best Price Guaranteed",
    description: "Find a lower price? We'll refund you 100% of the difference.",
  },
  {
    icon: <FaHeadset className="text-orange-600 w-10 h-10 p-2 rounded-full bg-orange-100" />,
    title: "Support 24/7",
    description: "Our team is always available to help you with bookings.",
  },
];

const ServiceBanner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-12  py-16 bg-gray-50 ">
      
      {/* Left Image */}
      <div className="relative w-full md:w-2/3 h-110 md:h-140 ">
        <Image
          src="/range.png"
          alt="Range of cars"
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-xl"
          priority
        />
      </div>

      {/* Right Content */}
      <div className="flex flex-col px-4 gap-6 md:w-1/2">
        <h1 className="text-orange-600 font-bold text-lg">BEST SERVICES</h1>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Feel the best experience <br /> with our rental deals
        </h2>

        {/* Service Items */}
        <div className="flex flex-col gap-6 mt-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-row items-center gap-4 p-4 "
            >
             <p className= "bg-slate-200 hover:bg-orange-50 rounded-xl transition-all duration-300 shadow-sm"> {service.icon}</p>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceBanner;
