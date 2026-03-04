"use client";
import React from 'react';

const testimonials = [
  {
    id: 1,
    name: "Christine Mutheu",
    role: "Business Executive",
    text: "AutoRentPro made my business trip incredibly smooth. The Mercedes E-Class was pristine, and the delivery service saved me hours.",
    profileImage: "/Profiles/christine.jpeg"
  },
  {
    id: 2,
    name: "Joel Mbithi",
    role: "Luxury Traveler",
    text: "I've rented luxury cars worldwide, but AutoRentPro stands out. Their attention to detail and customer service is exceptional.",
    profileImage: "/Profiles/Joe.jpeg"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Wedding Planner",
    text: "For our high-profile wedding clients, only AutoRentPro delivers the quality and reliability we need every single time.",
    profileImage: "/Profiles/emily.jpg"
  },
];

const Testimonials = () => {
  return (
    <div className="flex flex-col px-8 md:px-16 py-16 gap-12 max-w-6xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="block w-8 h-px bg-orange-600" />
          <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">
            Client Reviews
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            What our <span className="text-orange-600">clients</span> say.
          </h2>
          <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
            Real experiences from customers who've driven with us across Kenya and beyond.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-200">
        {testimonials.map((t, i) => (
          <div
            key={t.id}
            className="flex flex-col gap-5 p-8 border-b border-r border-gray-200 last:border-r-0 hover:bg-orange-50 transition-colors duration-200 group"
          >
            {/* stars */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-orange-400 text-sm">★</span>
              ))}
            </div>

            {/* quote */}
            <p className="text-gray-600 text-sm leading-relaxed flex-1">
              "{t.text}"
            </p>

            {/* bottom sweep */}
            <span className="block w-0 group-hover:w-10 h-px bg-orange-600 transition-all duration-300" />

            {/* client */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
              <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-gray-200">
                <img
                  src={t.profileImage}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  className="w-full h-full bg-orange-600 items-center justify-center text-white text-xs font-bold hidden"
                  style={{ display: 'none' }}
                >
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{t.name}</h3>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Testimonials;