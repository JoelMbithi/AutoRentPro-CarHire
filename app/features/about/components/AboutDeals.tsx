"use client";
import Image from "next/image";
import { Phone, BadgeCheck, Wrench, Headphones } from "lucide-react";
import React from "react";

const AboutDeals = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 lg:px-24 py-16 gap-12 bg-white">
      
      {/* LEFT SECTION */}
      <div className="flex flex-col max-w-md">
        <h1 className="font-extrabold text-4xl md:text-5xl text-gray-900 leading-tight">
          Best Car <span className="text-orange-500">Rental Deals</span>
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Drive premium vehicles at flexible rates — perfect for business, travel, or special events.
        </p>

        {/* CALL BOX */}
        <div className="flex items-center gap-4 mt-8 p-4 ">
          <div className="bg-orange-500 p-3 rounded-md">
            <Phone className="text-white" size={28} />
          </div>
          
          <div className="flex flex-col">
            <p className="text-gray-700 font-semibold text-lg">Call Us For Your Next Ride</p>
            <p className="text-gray-900 font-bold text-xl">(+254) 743 861 565</p>
          </div>
        </div>
      </div>

      {/* MIDDLE BENEFITS SECTION */}
      <div className="flex flex-col gap-6 max-w-sm">
        
        <div className="flex items-start gap-4">
          <BadgeCheck className="text-orange-500 mt-1" size={28} />
          <div>
            <h2 className="font-bold text-xl text-gray-900">Competitive Pricing</h2>
            <p className="text-gray-500 text-sm">
              Affordable daily and weekly rates with no hidden fees.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Wrench className="text-orange-500 mt-1" size={28} />
          <div>
            <h2 className="font-bold text-xl text-gray-900">Breakdown Assistance</h2>
            <p className="text-gray-500 text-sm">
              24/7 roadside help to keep your journey smooth and safe.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Headphones className="text-orange-500 mt-1" size={28} />
          <div>
            <h2 className="font-bold text-xl text-gray-900">24/7 Customer Support</h2>
            <p className="text-gray-500 text-sm">
              Always available to assist you anytime, anywhere.
            </p>
          </div>
        </div>

      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden md:flex  justify-center">
        <Image 
          src="/car2.png"
          alt="Featured Car"
          width={600}
          height={600}
          className="drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default AboutDeals;
