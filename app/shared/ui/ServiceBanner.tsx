"use client";

import Image from 'next/image';
import React from 'react';
import { FaTags, FaDollarSign, FaHeadset } from 'react-icons/fa';

const services = [
  {
    icon: <FaTags className="w-4 h-4" />,
    title: "Deals for Every Budget",
    description: "Competitive pricing on every vehicle category — economy to luxury — with no hidden charges.",
  },
  {
    icon: <FaDollarSign className="w-4 h-4" />,
    title: "Best Price Guaranteed",
    description: "Find the same car cheaper elsewhere and we'll refund 100% of the difference. No questions asked.",
  },
  {
    icon: <FaHeadset className="w-4 h-4" />,
    title: "24/7 Support",
    description: "Our team is on call around the clock — before, during, and after your rental.",
  },
];

const ServiceBanner = () => {
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-0 mt-10 bg-white">

      {/* Left — Image */}
      <div className="relative w-full md:w-1/2 h-80 md:h-auto min-h-[480px]">
        <Image
          src="/range.png"
          alt="AutoRentPro vehicle range"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* right-side fade to blend into content */}
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none hidden md:block" />
      </div>

      {/* Right — Content */}
      <div className="flex flex-col justify-center gap-8 px-8 md:px-16 py-16 md:w-1/2 bg-white">

        {/* header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="block w-8 h-px bg-orange-600" />
            <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">
              Best Services
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            The best experience,<br />
            at the right <span className="text-orange-600 ">price.</span>
          </h2>
        </div>

        {/* service items */}
        <div className="flex flex-col gap-0 border border-gray-100">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-row items-start gap-5 p-6 border-b border-gray-100 last:border-b-0 hover:bg-orange-50 transition-colors duration-200 group"
            >
              {/* icon square */}
              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-orange-600 text-white group-hover:bg-orange-700 transition-colors duration-200">
                {service.icon}
              </div>

              {/* text */}
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ServiceBanner;