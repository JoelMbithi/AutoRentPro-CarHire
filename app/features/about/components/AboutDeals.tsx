"use client";
import Image from "next/image";
import { Phone, BadgeCheck, Wrench, Headphones } from "lucide-react";
import React from "react";

const AboutDeals = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-24 py-10 sm:py-12 lg:py-16 gap-8 sm:gap-10 lg:gap-12 bg-white">

      {/* ── Left — Content ── */}
      <div className="flex flex-col w-full lg:w-1/2 gap-6 sm:gap-8">

        {/* Header */}
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight text-center lg:text-left">
            Best Car <span className="text-orange-500">Rental Deals</span>
          </h1>
          <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base text-center lg:text-left">
            Drive premium vehicles at flexible rates — perfect for business, travel, or special events.
          </p>
        </div>

        {/* Call box */}
        <div className="flex justify-center lg:justify-start">
          <div className="flex items-center gap-3 p-3 sm:p-4 border border-gray-100 rounded-lg bg-gray-50 w-full sm:w-auto">
            <div className="bg-orange-500 p-2 sm:p-2.5 rounded-md shrink-0">
              <Phone className="text-white" size={18} />
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Call us for your next ride</p>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">(+254) 743 861 565</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {[
            { icon: <BadgeCheck className="text-orange-500 mt-0.5 shrink-0" size={20} />, title: "Competitive Pricing",   desc: "Affordable daily and weekly rates with no hidden fees." },
            { icon: <Wrench      className="text-orange-500 mt-0.5 shrink-0" size={20} />, title: "Breakdown Assistance",  desc: "24/7 roadside help to keep your journey smooth and safe." },
            { icon: <Headphones  className="text-orange-500 mt-0.5 shrink-0" size={20} />, title: "24/7 Customer Support", desc: "Always available to assist you anytime, anywhere." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-2 sm:gap-3">
              {item.icon}
              <div>
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base">{item.title}</h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right — Image ── */}
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="hidden md:flex relative w-full max-w-xs sm:max-w-sm lg:max-w-full aspect-[4/3]">
          <Image
            src="/car2.png"
            alt="Featured Car"
            fill
            className="object-contain drop-shadow-md"
          />
        </div>
      </div>

    </div>
  );
};

export default AboutDeals;