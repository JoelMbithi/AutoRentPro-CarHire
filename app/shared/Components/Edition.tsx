"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const features = [
  { title: "Award Winning",   desc: "5-time winner of Best Luxury Rental Service with 50,000+ satisfied customers worldwide." },
  { title: "Fully Insured",   desc: "Comprehensive coverage, zero deductibles, and 24/7 roadside assistance on every booking." },
  { title: "Instant Booking", desc: "Reserve your vehicle in under 2 minutes with our streamlined digital process." },
  { title: "Global Network",  desc: "Pick up and drop off at 200+ locations across 25 countries." },
];

const promises = [
  { title: "Premium Maintenance",    desc: "Every vehicle passes a 150-point inspection before each rental, maintained to manufacturer standards." },
  { title: "Personalized Concierge", desc: "Dedicated account managers for corporate clients. We remember your preferences every time." },
  { title: "Flexible Cancellation",  desc: "Free cancellation up to 24 hours before pickup. Completely transparent pricing, no surprises." },
  { title: "Latest Technology",      desc: "GPS, premium sound, 360° cameras, and collision avoidance systems across the entire fleet." },
];

const services = [
  { title: "Luxury Fleet",      desc: "Premium vehicles from sleek sedans to powerful SUVs — meticulously maintained for your comfort." },
  { title: "Unmatched Service", desc: "White-glove attention from booking to return. Every detail handled perfectly." },
  { title: "Flexible Plans",    desc: "Daily, weekly, or monthly rentals. No hidden fees, comprehensive insurance included." },
  { title: "Nationwide Cover",  desc: "Multiple pickup and drop-off points across the country for business or leisure." },
];

const Edition = () => {
  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <div className="flex flex-col md:flex-row items-center gap-12 px-8 md:px-16 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">AutoRentPro</p>
          <h1 className="text-5xl sm:text-6xl font-bold leading-none mb-6 text-gray-900">
            Car<br />Rental<br />
            <span className="text-orange-600">Experience.</span>
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-sm">
            Luxury, comfort, and performance vehicles — ready for your next journey across Kenya and beyond.
          </p>
          <div className="flex gap-3">
            <Link href="/vehicles" className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-6 py-2.5 rounded transition-colors">
              Explore Fleet
            </Link>
            <Link href="/about" className="border border-gray-300 hover:border-gray-400 text-gray-600 text-sm font-medium px-6 py-2.5 rounded transition-colors">
              Learn More
            </Link>
          </div>
        </div>

        <div className="hidden md:block flex-1">
          <Image src="/GPS.jpg" alt="Car rental" width={600} height={400} className="rounded w-full object-cover" />
        </div>
      </div>

      {/* ── What we offer — large text intro + tight list ── */}
      <div className="border-t border-gray-100 px-8 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug mb-12 max-w-lg">
            Everything you need,<br />nothing you don't.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-10">
            {services.map((s, i) => (
              <div key={i}>
                <p className="text-xs text-gray-400 mb-2">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why us — dark band ── */}
      <div className="bg-gray-900 px-8 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-2xl font-bold text-white mb-3">Why AutoRentPro</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                We've built a rental experience that respects your time and your trust.
              </p>
            </div>
            <div className="md:w-2/3 flex flex-col divide-y divide-gray-700">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:gap-12 py-5">
                  <h3 className="text-sm font-medium text-white sm:w-40 shrink-0 mb-1 sm:mb-0">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Promise + CTA ── */}
      <div className="px-8 md:px-16 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">

          {/* Promises */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Our promise</h2>
            <p className="text-sm text-gray-500 mb-8">Details that matter.</p>
            <div className="flex flex-col divide-y divide-gray-100">
              {promises.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:gap-12 py-4">
                  <h3 className="text-sm font-medium text-gray-900 sm:w-44 shrink-0 mb-1 sm:mb-0">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA panel */}
          <div className="md:w-72 shrink-0 flex flex-col gap-10">
            <p className="text-sm text-gray-400 italic leading-relaxed border-l-2 border-orange-500 pl-4">
              "We didn't just rent cars — we deliver confidence, comfort, and class. From the moment you book until you return the keys."
            </p>
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Ready to drive?</h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">Book a consultation or browse our full fleet today.</p>
              <div className="flex flex-col gap-2">
                <Link href="/contact" className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-5 py-2.5 rounded transition-colors text-center">
                  Book Consultation
                </Link>
                <Link href="/vehicles" className="border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium px-5 py-2.5 rounded transition-colors text-center">
                  Browse Fleet
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Edition;