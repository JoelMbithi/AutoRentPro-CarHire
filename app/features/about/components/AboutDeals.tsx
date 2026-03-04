"use client";
import Image from "next/image";
import { Phone, BadgeCheck, Wrench, Headphones } from "lucide-react";
import React from "react";

const AboutDeals = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 lg:px-24 py-16 gap-12 bg-white">

      {/* Left */}
      <div className="flex flex-col max-w-md">
        <h1 className="font-bold text-3xl md:text-4xl text-gray-900 leading-tight">
          Best Car <span className="text-orange-500">Rental Deals</span>
        </h1>

        <p className="text-gray-500 mt-3 text-base">
          Drive premium vehicles at flexible rates — perfect for business, travel, or special events.
        </p>

        {/* Call box */}
        <div className="flex items-center gap-3 mt-7 p-4 border border-gray-100 rounded-lg bg-gray-50 w-fit">
          <div className="bg-orange-500 p-2.5 rounded-md shrink-0">
            <Phone className="text-white" size={20} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Call us for your next ride</p>
            <p className="text-gray-900 font-semibold text-base">(+254) 743 861 565</p>
          </div>
        </div>
      </div>

      {/* Middle — benefits */}
      <div className="flex flex-col gap-5 max-w-sm">

        <div className="flex items-start gap-3">
          <BadgeCheck className="text-orange-500 mt-0.5 shrink-0" size={22} />
          <div>
            <h2 className="font-semibold text-gray-900">Competitive Pricing</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Affordable daily and weekly rates with no hidden fees.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Wrench className="text-orange-500 mt-0.5 shrink-0" size={22} />
          <div>
            <h2 className="font-semibold text-gray-900">Breakdown Assistance</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              24/7 roadside help to keep your journey smooth and safe.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Headphones className="text-orange-500 mt-0.5 shrink-0" size={22} />
          <div>
            <h2 className="font-semibold text-gray-900">24/7 Customer Support</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Always available to assist you anytime, anywhere.
            </p>
          </div>
        </div>

      </div>

      {/* Right — image */}
      <div className="hidden md:flex justify-center">
        <Image
          src="/car2.png"
          alt="Featured Car"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

export default AboutDeals;