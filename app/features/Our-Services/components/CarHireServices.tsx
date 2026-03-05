'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaPhone, FaClock, FaCar, FaCreditCard, FaCheck, FaArrowRight } from 'react-icons/fa';
import { IoSpeedometer, IoLocationSharp, IoShieldCheckmark } from 'react-icons/io5';
import Link from 'next/link';

const CarHireServices = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [showAllInsurance, setShowAllInsurance] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on client side only
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCheckAvailability = () => {
    const searchParams = new URLSearchParams();
    if (pickupDate) searchParams.append('pickupDate', pickupDate);
    if (returnDate) searchParams.append('returnDate', returnDate);
    if (pickupLocation) searchParams.append('location', pickupLocation);
    if (selectedCategory && selectedCategory !== 'all') searchParams.append('category', selectedCategory);
    router.push(`/vehicles?${searchParams.toString()}`);
  };

  const handleRentNow = () => router.push('/vehicles');

  const serviceFeatures = [
    { icon: <FaCar className="text-orange-500" size={20} />,             title: 'Wide Selection',     description: 'Economy to luxury vehicles for every need and budget, with regular fleet updates.' },
    { icon: <FaCreditCard className="text-orange-500" size={20} />,      title: 'Best Prices',        description: 'Competitive rates with no hidden fees and special discounts for long-term rentals.' },
    { icon: <IoSpeedometer className="text-orange-500" size={20} />,     title: 'Instant Booking',    description: 'Reserve your vehicle in minutes with real-time availability and instant confirmation.' },
    { icon: <IoShieldCheckmark className="text-orange-500" size={20} />, title: 'Full Insurance',     description: 'Comprehensive coverage including collision damage waiver and theft protection.' },
    { icon: <IoLocationSharp className="text-orange-500" size={20} />,   title: 'Multiple Locations', description: 'Convenient pickup and drop-off points across the city including airport terminals.' },
    { icon: <FaPhone className="text-orange-500" size={20} />,           title: '24/7 Support',       description: 'Round-the-clock customer service and roadside assistance throughout your rental.' },
  ];

  const locations = [
    { id: 1, name: 'Downtown Office',   address: '123 Main Street, Downtown',     phone: '+1 (555) 123-4567', hours: 'Mon–Sun: 6 AM – 11 PM' },
    { id: 2, name: 'Airport Terminal',  address: 'Airport Boulevard, Terminal 2', phone: '+1 (555) 123-4568', hours: '24/7 Operation' },
    { id: 3, name: 'City Center',       address: '456 Central Avenue',            phone: '+1 (555) 123-4569', hours: 'Mon–Sun: 7 AM – 10 PM' },
    { id: 4, name: 'Business District', address: '789 Corporate Drive',           phone: '+1 (555) 123-4570', hours: 'Mon–Fri: 6 AM – 9 PM' },
  ];

  const insuranceOptions = [
    {
      name: 'Basic Coverage',    price: '$15/day', popular: false,
      description: 'Essential coverage for peace of mind',
      features: ['Liability Protection', 'Basic Theft Protection', '24/7 Customer Support'],
    },
    {
      name: 'Premium Coverage',  price: '$25/day', popular: true,
      description: 'Comprehensive protection',
      features: ['Full Collision Coverage', 'Theft Protection', 'Roadside Assistance', 'Zero Deductible'],
    },
    {
      name: 'Platinum Coverage', price: '$35/day', popular: false,
      description: 'Ultimate peace of mind',
      features: ['Zero Deductible', 'Personal Accident Insurance', '24/7 Concierge', 'Trip Interruption'],
    },
  ];

  const categories = [
    { value: 'all',      label: 'All' },
    { value: 'ECONOMY',  label: 'Economy' },
    { value: 'SUV',      label: 'SUV' },
    { value: 'LUXURY',   label: 'Luxury' },
    { value: 'SPORTS',   label: 'Sports' },
    { value: 'COMPACT',  label: 'Compact' },
    { value: 'MIDSIZE',  label: 'Midsize' },
    { value: 'FULLSIZE', label: 'Fullsize' },
  ];

  // Determine which insurance plans to show
  const visibleInsurance = isMobile && !showAllInsurance 
    ? insuranceOptions.slice(0, 1) 
    : insuranceOptions;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section
        className="relative text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/Service.png')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-24 lg:py-50">

          <div className="mb-5 sm:mb-10 max-w-xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-2 sm:mb-3">
              Car Hire Services
            </h1>
            {/* Subtitle: not essential on mobile */}
            <p className="hidden sm:block text-gray-300 text-base leading-relaxed">
              Find the right vehicle for any journey — economy to luxury, short trips to long-term rentals.
            </p>
          </div>

          {/* Booking form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-white/80 mb-1.5">Pickup location</label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="" className="text-gray-800">Select location</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.name} className="text-gray-800">{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">Pickup date</label>
                <input
                  type="date" value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">Return date</label>
                <input
                  type="date" value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Category pills: hidden inside form on mobile — shown in strip below */}
            <div className="hidden sm:flex gap-2 mb-4 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap shrink-0 transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCheckAvailability}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Check Availability
            </button>

            {/* Stats: show only 2 on mobile, all 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-white/20">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-orange-400">5,000+</p>
                <p className="text-white/70 text-xs mt-0.5">Happy customers</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-orange-400">24/7</p>
                <p className="text-white/70 text-xs mt-0.5">Support</p>
              </div>
              {/* Hidden on mobile */}
              <div className="hidden sm:block text-center">
                <p className="text-2xl font-bold text-orange-400">50+</p>
                <p className="text-white/70 text-xs mt-0.5">Vehicles</p>
              </div>
              <div className="hidden sm:block text-center">
                <p className="text-2xl font-bold text-orange-400">15+</p>
                <p className="text-white/70 text-xs mt-0.5">Locations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category strip (mobile only, below hero) ── */}
      <div className="sm:hidden bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Why choose us ── */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-10">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Why choose AutoRentPro?</h2>
          {/* Section subtitle not needed on mobile */}
          <p className="hidden sm:block text-gray-500 text-sm mt-1">Reliable service, transparent pricing, and support when you need it.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {serviceFeatures.map((feature, i) => (
            <div key={i} className="flex gap-3 p-3 sm:p-5 border border-gray-200 rounded-xl hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
              <div className="shrink-0 mt-0.5">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-0.5">{feature.title}</h3>
                {/* Feature descriptions hidden on mobile — icon + title is enough */}
                <p className="hidden sm:block text-gray-500 text-xs leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Insurance ── */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Insurance options</h2>
            <p className="hidden sm:block text-gray-500 text-sm mt-1">Choose the level of cover that works for you.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {visibleInsurance.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-xl p-5 sm:p-6 border transition-colors ${
                  plan.popular
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white border-gray-200 hover:border-orange-300'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-5 bg-white text-orange-600 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200">
                    Most popular
                  </span>
                )}
                <h3 className={`font-bold text-lg mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`text-3xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-orange-600'}`}>{plan.price}</p>
                <p className={`text-sm mb-4 sm:mb-5 ${plan.popular ? 'text-orange-200' : 'text-gray-500'}`}>{plan.description}</p>
                <ul className="space-y-2 mb-5 sm:mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                      <FaCheck className={`shrink-0 text-xs ${plan.popular ? 'text-orange-200' : 'text-orange-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-white text-orange-600 hover:bg-orange-50'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}>
                  Select plan
                </button>
              </div>
            ))}
          </div>

          {/* Show More / Show Less button - visible only on mobile */}
          {isMobile && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllInsurance(!showAllInsurance)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                {showAllInsurance ? (
                  <>Show less <FaArrowRight className="rotate-90" size={12} /></>
                ) : (
                  <>Show more plans <FaArrowRight size={12} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Locations ── */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Our locations</h2>
            <p className="hidden sm:block text-gray-500 text-sm mt-1">Convenient pickup and drop-off points near you.</p>
          </div>
          {/* 2-col compact on mobile, 4-col full on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {locations.map((loc) => (
              <div key={loc.id} className="border border-gray-200 rounded-xl p-3 sm:p-5 hover:border-orange-200 transition-colors">
                <div className="flex items-start gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <FaMapMarkerAlt className="text-orange-500 shrink-0 mt-0.5" size={11} />
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight">{loc.name}</h3>
                </div>
                {/* Address hidden on mobile */}
                <p className="hidden sm:block text-gray-500 text-xs mb-3 leading-relaxed">{loc.address}</p>
                <div className="space-y-1 sm:space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <FaPhone className="text-gray-300 shrink-0" size={9} />
                    <span className="truncate">{loc.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaClock className="text-gray-300 shrink-0" size={9} />
                    <span className="truncate">{loc.hours}</span>
                  </div>
                </div>
                <button className="w-full mt-3 text-xs font-medium text-orange-600 hover:text-orange-700 border border-orange-200 hover:border-orange-400 rounded-lg py-1.5 sm:py-2 transition-colors flex items-center justify-center gap-1">
                  Directions <FaArrowRight size={8} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 sm:mb-10">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">How it works</h2>
            <p className="hidden sm:block text-gray-500 text-sm mt-1">Rent a car in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { step: 1, title: 'Choose your car',  description: 'Browse our fleet and filter by type, price, or features to find the right fit.' },
              { step: 2, title: 'Book online',       description: 'Complete your booking securely. Add insurance or extras as needed.' },
              { step: 3, title: 'Pick up and drive', description: 'Collect your car from one of our locations. Everything is ready when you arrive.' },
            ].map((s) => (
              <div key={s.step} className="flex gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">{s.title}</h3>
                  {/* Step description hidden on mobile */}
                  <p className="hidden sm:block text-gray-500 text-sm leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 bg-orange-500">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">Ready to hit the road?</h2>
          {/* Paragraph hidden on mobile — headline + buttons are enough */}
          <p className="hidden sm:block text-orange-200 text-sm mb-7 leading-relaxed">
            Book your rental today. Join 5,000+ customers who trust AutoRentPro for reliable, hassle-free car hire.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mt-4 sm:mt-0">
            <button
              onClick={handleRentNow}
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-orange-600 font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
            >
              Rent now
            </button>
            <Link
              href="/contact"
              className="w-full sm:w-auto text-center border border-white/50 hover:border-white text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
            >
              Contact us
            </Link>
          </div>
          <p className="mt-4 sm:mt-5 text-orange-200 text-sm flex items-center justify-center gap-2">
            <FaPhone size={12} />
            +(254) 743 861 565
          </p>
        </div>
      </section>

    </div>
  );
};

export default CarHireServices;