"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const stats = [
  { value: "500+", label: "Vehicles hired" },
  { value: "8+", label: "Years in operation" },
  { value: "24/7", label: "Customer support" },
  { value: "4.8", label: "Average rating" },
];

const values = [
  {
    title: "Transparent Pricing",
    desc: "The price you see is the price you pay. No hidden fees, no surprise charges at collection.",
  },
  {
    title: "Well-Maintained Fleet",
    desc: "Every vehicle is serviced regularly and inspected before each hire. You drive it, we maintain it.",
  },
  {
    title: "Straightforward Process",
    desc: "Book online, present your licence and card at collection, and you're on the road.",
  },
  {
    title: "Roadside Assistance",
    desc: "Breakdown cover is included with every rental. Help is one call away, any time of day.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">

      {/* Hero */}
      <section
        className="relative min-h-[52vh] flex items-end bg-cover bg-center"
        style={{ backgroundImage: "url('/dashboard.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-12 max-w-2xl">
          <p className="text-xs text-gray-300 uppercase tracking-widest mb-3">
            Nairobi, Kenya
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white leading-snug mb-4">
            Reliable car hire<br />for every journey.
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-lg">
            AutoRentPro has been serving individuals and businesses across Kenya
            since 2016. We keep it simple — good vehicles, honest prices, and
            support when you need it.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/vehicles"
              className="px-5 py-2.5 bg-orange-500 text-white text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Fleet
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 border border-white/40 text-white text-sm font-medium hover:border-white transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-orange-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-gray-200">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center px-4">
              <span className="text-2xl font-semibold text-orange-500">{s.value}</span>
              <span className="text-xs text-gray-400 mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-18 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          <p className="text-xs text-orange-500 uppercase tracking-widest">Who we are</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug">
            A local hire company built on reliability.
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            We started AutoRentPro to offer Nairobi residents and visitors a
            straightforward car hire experience — no confusing packages, no
            hard sells. Just the vehicle you need at a fair price.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Our fleet covers everything from compact saloons for city driving to
            4WDs for upcountry trips. Every vehicle is fully insured, regularly
            serviced, and ready to go.
          </p>
       
        </div>
        <div className="w-full lg:w-1/2 hidden md:block">
          <div className="relative w-full aspect-[4/3]">
            <Image
              src="/car2.png"
              alt="AutoRentPro vehicle"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-orange-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-10 lg:px-16 py-14">
          <p className="text-xs text-orange-500 uppercase tracking-widest mb-2">What to expect</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-8">How we operate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-gray-100 px-5 py-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      
    </main>
  );
}