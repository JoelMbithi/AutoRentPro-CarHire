"use client";
import Image from "next/image";
import React from "react";

const AboutDeals = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 xl:px-24 py-12 lg:py-16 gap-10 lg:gap-12 bg-white">

      {/* Left — Content */}
      <div className="flex flex-col w-full lg:w-1/2 gap-6">

        <div>
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight text-center lg:text-left">
            Best Car <span className="text-orange-500">Rental Deals</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base text-center lg:text-left">
            Drive premium vehicles at flexible rates — perfect for business, travel, or special events.
          </p>
        </div>

        {/* Phone */}
        <div className="flex justify-center lg:justify-start">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Call us for your next ride</p>
            <a href="tel:+254743861565" className="text-gray-900 font-semibold text-base hover:text-orange-600 transition-colors">
              (+254) 743 861 565
            </a>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-4">
          {[
            { title: "Competitive Pricing",   desc: "Affordable daily and weekly rates with no hidden fees." },
            { title: "Breakdown Assistance",  desc: "24/7 roadside help to keep your journey smooth and safe." },
            { title: "24/7 Customer Support", desc: "Always available to assist you anytime, anywhere." },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="font-semibold text-gray-900 text-sm">{item.title}</h2>
              <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Image */}
      <div className="w-full lg:w-1/2 hidden md:flex justify-center items-center">
        <div className="relative w-full max-w-sm lg:max-w-full aspect-[4/3]">
          <Image
            src="/car2.png"
            alt="Featured Car"
            fill
            className="object-contain"
          />
        </div>
      </div>

    </div>
  );
};

export default AboutDeals;