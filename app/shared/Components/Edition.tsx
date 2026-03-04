"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const features = [
  { n: "01", title: "Award Winning",   desc: "5-time winner of 'Best Luxury Rental Service' with 50,000+ satisfied customers worldwide."     },
  { n: "02", title: "Fully Insured",   desc: "Comprehensive coverage, zero deductibles, and 24/7 roadside assistance on every booking."       },
  { n: "03", title: "Instant Booking", desc: "Reserve your vehicle in under 2 minutes with our streamlined digital process."                   },
  { n: "04", title: "Global Network",  desc: "Pick up and drop off at 200+ locations across 25 countries."                                     },
];

const promises = [
  { title: "Premium Maintenance",    desc: "Every vehicle passes a 150-point inspection before each rental, maintained to manufacturer standards." },
  { title: "Personalized Concierge", desc: "Dedicated account managers for corporate clients. We remember your preferences every time."           },
  { title: "Flexible Cancellation",  desc: "Free cancellation up to 24 hours before pickup. Completely transparent pricing, no surprises."       },
  { title: "Latest Technology",      desc: "GPS, premium sound, 360° cameras, and collision avoidance systems across the entire fleet."           },
];

const stats = [
  { value: "98%",  label: "Satisfaction"  },
  { value: "50K+", label: "Customers"     },
  { value: "24/7", label: "Support"       },
  { value: "200+", label: "Vehicles"      },
];

const services = [
  { n: "01", title: "Luxury Fleet",       desc: "Premium vehicles from sleek sedans to powerful SUVs — meticulously maintained for your comfort." },
  { n: "02", title: "Unmatched Service",  desc: "White-glove attention from booking to return. Every detail handled perfectly."                    },
  { n: "03", title: "Flexible Plans",     desc: "Daily, weekly, or monthly rentals. No hidden fees, comprehensive insurance included."             },
  { n: "04", title: "Nationwide Cover",   desc: "Multiple pickup and drop-off points across the country for business or leisure."                  },
];

const Edition = () => {
  return (
    <div className="flex flex-col w-full">

      {/* ── HERO — your bg image, kept exactly ── */}
      <div
        className="flex flex-row items-center justify-center px-12 "
      >
  

        <div className="flex flex-col justify-center items-center text-center z-10 max-w-6xl">

          {/* eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-">
            <span className="block w-8 h-px bg-orange-500" />
            <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">AutoRent Pro</span>
            <span className="block w-8 h-px bg-orange-500" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Car Rental<br />
            <span className="text-orange-600">Experience.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed">
            Luxury, comfort, and performance vehicles — ready for your next journey across Kenya and beyond.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/vehicles"
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-8 py-4 transition-colors duration-200 tracking-wide"
            >
              Explore Fleet
            </Link>
            <Link
              href="/about"
              className="border border-gray-400 hover:border-orange-600 text-gray-400 hover:text-orange-600 text-sm font-semibold px-8 py-4 transition-all duration-200 tracking-wide"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="hidden md:flex w-200 h-100">
          <Image 
                      src="/GPS.jpg" 
                      alt="discussion" 
                      width={600} 
                      height={200} 
                      className="rounded"
                    />
        </div>
      </div>

      {/* ── SERVICES ── */}
      <div className="flex flex-col px-8 md:px-16 py-16 gap-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="block w-8 h-px bg-orange-600" />
            <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">What We Offer</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Built for every <span className="text-orange-600">journey.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200">
          {services.map((s, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-8 border-b border-r border-gray-200 hover:bg-orange-50 transition-colors duration-200 group"
            >
              <span className="text-xs font-semibold text-gray-400 tracking-widest group-hover:text-orange-500 transition-colors duration-200">{s.n}</span>
              <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              <span className="block w-0 group-hover:w-12 h-px bg-orange-600 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY US ── */}
      <div className="flex flex-col px-8 md:px-16 py-16 gap-10 bg-gray-50 w-full">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-10">

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-orange-600" />
              <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">Why AutoRentPro</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              The <span className="text-orange-600">difference</span> you'll feel.
            </h2>
          </div>

          {/* feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-gray-200">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-6 border-b border-r border-gray-200 hover:bg-white transition-colors duration-200 group"
              >
                <span className="text-xs font-semibold text-gray-400 tracking-widest group-hover:text-orange-500 transition-colors duration-200">{f.n}</span>
                <h3 className="text-base font-bold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 borde border-gray-200">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-1 py-8 border-r border-gray-200 last:border-r-0">
                <span className="text-3xl font-extrabold text-orange-600 leading-none">{s.value}</span>
                <span className="text-xs text-gray-400 tracking-widest uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROMISE ── */}
      <div className="flex flex-col px-8 md:px-16 py-16 gap-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="block w-8 h-px bg-orange-600" />
            <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">Our Promise</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Details that <span className="text-orange-600">matter.</span>
          </h2>
        </div>

        {/* promise grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200">
          {promises.map((p, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-8 border-b border-r border-gray-200 hover:bg-orange-50 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 flex-shrink-0" />
                <h3 className="text-base font-bold text-gray-900">{p.title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* quote */}
        <div className="border border-gray-200 p-10">
          <span className="block text-xs text-orange-600 font-semibold tracking-widest uppercase mb-4">✦ The AutoRentPro Difference</span>
          <p className="text-xs md:text-xl text-gray-500 font-medium italic leading-relaxed max-w-2xl">
            "We don't just rent cars — we deliver{" "}
            <span className="text-gray-700 not-italic font-semibold">confidence, comfort, and class.</span>{" "}
            From the moment you book until you return the keys."
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 borde border-gray-200 p-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-gray-900">Ready to <span className="text-orange-600 ">drive?</span></h3>
            <p className="text-sm text-gray-500">Book a consultation or browse our full fleet today.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/contact"
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-6 py-3 transition-colors duration-200 tracking-wide"
            >
              Book Consultation
            </Link>
            <Link
              href="/vehicles"
              className="border border-gray-300 hover:border-orange-600 text-gray-500 hover:text-orange-600 text-sm font-semibold px-6 py-3 transition-all duration-200 tracking-wide"
            >
              Browse Fleet
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Edition;