"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const services = [
  {
    num: "01",
    title: "Self-Drive Hire",
    desc: "Pick up your vehicle, drive at your own pace. Full insurance and breakdown cover included on every booking.",
  },
  {
    num: "02",
    title: "Corporate Accounts",
    desc: "Reliable transport for businesses — staff travel, client transfers, and site visits with invoicing available.",
  },
  {
    num: "03",
    title: "Airport Transfers",
    desc: "Pre-booked pickups and drop-offs at JKIA and Wilson Airport. On time, every time.",
  },
  {
    num: "04",
    title: "Upcountry & Long-Distance",
    desc: "4WDs and larger vehicles for travel outside Nairobi. Cross-border hire available on request.",
  },
];

const reasons = [
  {
    title: "No Hidden Charges",
    desc: "The quoted rate is what you pay. Fuel, mileage terms, and deposit amounts are disclosed upfront before you confirm.",
  },
  {
    title: "Vehicles Ready to Go",
    desc: "Every car is inspected, cleaned, and fuelled before collection. You sign the condition report, then you drive.",
  },
  {
    title: "Flexible Hire Periods",
    desc: "Daily, weekly, or monthly hire at consistent rates. No penalties for extending — just notify us in advance.",
  },
  {
    title: "24/7 Breakdown Support",
    desc: "If anything goes wrong on the road, call us. Roadside assistance is included with every rental at no extra cost.",
  },
];

const promises = [
  {
    title: "Insured & Compliant",
    desc: "All vehicles carry third-party liability cover as required by Kenyan law, plus CDW and theft protection.",
  },
  {
    title: "Regular Servicing",
    desc: "Fleet vehicles are serviced on a fixed schedule. Tyres, brakes, and engine health are checked before each hire.",
  },
  {
    title: "Free Cancellation",
    desc: "Cancel up to 48 hours before pickup at no charge. Late cancellations are subject to a 25% fee.",
  },
  {
    title: "Simple Documentation",
    desc: "You need a valid driver's licence, a credit or debit card, and a government-issued ID. Nothing more.",
  },
];

const Edition = () => {
  return (
    <div className="w-full bg-white">

      {/* ── Hero ── */}
      <div className="flex flex-col md:flex-row items-center gap-10 px-6 sm:px-10 md:px-16 py-14 max-w-6xl mx-auto">
        <div className="flex flex-col flex-1 gap-5">
          <p className="text-xs text-orange-500 uppercase tracking-widest font-medium">AutoRentPro — Nairobi, Kenya</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
            Hire a car.<br />
            Drive with<br />
            <span className="text-orange-500">confidence.</span>
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            A straightforward car hire service for individuals, families, and businesses across Kenya.
            Well-maintained vehicles, honest pricing, and support on the road.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/vehicles"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Browse Fleet
            </Link>
            <Link
              href="/contact"
              className="border border-gray-200 hover:border-orange-400 hover:text-orange-500 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Make an Enquiry
            </Link>
          </div>
        </div>

        <div className="w-full md:flex-1 hidden md:block">
          <Image
            src="/GPS.jpg"
            alt="AutoRentPro vehicle interior"
            width={600}
            height={400}
            className="rounded-lg w-full object-cover"
          />
        </div>
      </div>

      {/* ── What we offer ── */}
      <div className="border-t border-gray-100 bg-orange-50 px-6 sm:px-10 md:px-16 py-14">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-orange-500 uppercase tracking-widest font-medium mb-2">Our services</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-10">What we offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.num} className="bg-white border border-orange-100 rounded-lg px-5 py-5">
                <p className="text-xs text-orange-400 font-medium mb-3">{s.num}</p>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why AutoRentPro ── */}
      <div className="px-6 sm:px-10 md:px-16 py-14 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3 shrink-0">
            <p className="text-xs text-orange-500 uppercase tracking-widest font-medium mb-2">Why us</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Why AutoRentPro</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We built this service around one idea — car hire should be simple,
              predictable, and stress-free.
            </p>
          </div>
          <div className="flex-1 divide-y divide-gray-100">
            {reasons.map((r) => (
              <div key={r.title} className="flex flex-col sm:flex-row sm:gap-10 py-5">
                <h3 className="text-sm font-semibold text-gray-900 sm:w-44 shrink-0 mb-1 sm:mb-0">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Our promise + CTA ── */}
      <div className="bg-orange-50 border-t border-orange-100 px-6 sm:px-10 md:px-16 py-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">

          {/* Promises */}
          <div className="flex-1">
            <p className="text-xs text-orange-500 uppercase tracking-widest font-medium mb-2">Standards</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Our promise to you</h2>
            <div className="divide-y divide-gray-200">
              {promises.map((p) => (
                <div key={p.title} className="flex flex-col sm:flex-row sm:gap-10 py-5">
                  <h3 className="text-sm font-semibold text-gray-900 sm:w-44 shrink-0 mb-1 sm:mb-0">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

         
        </div>
      </div>

    </div>
  );
};

export default Edition;