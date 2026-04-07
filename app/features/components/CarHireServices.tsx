'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheck } from 'react-icons/fa';
import Link from 'next/link';

const CarHireServices = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  const handleCheckAvailability = () => {
    const params = new URLSearchParams();
    if (pickupDate) params.append('pickupDate', pickupDate);
    if (returnDate) params.append('returnDate', returnDate);
    if (pickupLocation) params.append('location', pickupLocation);
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    router.push(`/vehicles?${params.toString()}`);
  };

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

  const serviceFeatures = [
    { title: 'Wide Selection',     description: 'Economy to luxury vehicles for every need and budget, with regular fleet updates.' },
    { title: 'Best Prices',        description: 'Competitive rates with no hidden fees and special discounts for long-term rentals.' },
    { title: 'Instant Booking',    description: 'Reserve your vehicle in minutes with real-time availability and instant confirmation.' },
    { title: 'Full Insurance',     description: 'Comprehensive coverage including collision damage waiver and theft protection.' },
    { title: 'Multiple Locations', description: 'Convenient pickup and drop-off points across the city including airport terminals.' },
    { title: '24/7 Support',       description: 'Round-the-clock customer service and roadside assistance throughout your rental.' },
  ];

  const locations = [
    { id: 1, name: 'Downtown Office',   address: '123 Main Street, Downtown',     phone: '+1 (254)743 234 567', hours: 'Mon–Sun: 6 AM – 11 PM' },
    { id: 2, name: 'Airport Terminal',  address: 'Airport Boulevard, Terminal 2', phone: '+1 (254)743 234 568', hours: '24/7 Operation' },
    { id: 3, name: 'City Center',       address: '456 Central Avenue',            phone: '+1 (254)743 234 569', hours: 'Mon–Sun: 7 AM – 10 PM' },
    { id: 4, name: 'Business District', address: '789 Corporate Drive',           phone: '+1 (254)743 234 570', hours: 'Mon–Fri: 6 AM – 9 PM' },
  ];

  const insuranceOptions = [
    {
      name: 'Basic Coverage',
      price: 'Ksh 1,860/day',
      popular: false,
      features: ['Liability Protection', 'Basic Theft Protection', '24/7 Customer Support'],
    },
    {
      name: 'Premium Coverage',
      price: 'Ksh 3,100/day',
      popular: true,
      features: ['Full Collision Coverage', 'Theft Protection', 'Roadside Assistance', 'Zero Deductible'],
    },
    {
      name: 'Platinum Coverage',
      price: 'Ksh 4,340/day',
      popular: false,
      features: ['Zero Deductible', 'Personal Accident Insurance', '24/7 Concierge', 'Trip Interruption'],
    },
  ];

  const inputClass = 'w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-orange-400 placeholder-white/50';
  const labelClass = 'block text-xs text-white/70 mb-1';

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section
        className="relative text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/Service.png')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 lg:py-28">

          <div className="mb-8 max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
              Car Hire Services
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed hidden sm:block">
              Find the right vehicle for any journey — economy to luxury, short trips to long-term rentals.
            </p>
          </div>

          {/* Booking form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded p-5 sm:p-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Pickup location</label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className={inputClass}
                >
                  <option value="" className="text-gray-800">Select location</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.name} className="text-gray-800">{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Pickup date</label>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Return date</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded text-xs whitespace-nowrap shrink-0 transition-colors border ${
                    selectedCategory === cat.value
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCheckAvailability}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded text-sm transition-colors"
            >
              Check Availability
            </button>
          </div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="py-12 sm:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Why choose AutoRentPro?</h2>
          <p className="text-sm text-gray-500 mb-8">Reliable service, transparent pricing, and support when you need it.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceFeatures.map((feature, i) => (
              <div key={i} className="border border-gray-200 rounded p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Insurance ── */}
      <section className="py-12 sm:py-16 px-6 bg-orange-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Insurance options</h2>
          <p className="text-sm text-gray-500 mb-8">Choose the level of cover that works for you.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {insuranceOptions.map((plan, i) => (
              <div key={i} className={`relative border rounded p-5 ${plan.popular ? 'border-orange-200 bg-white' : 'border-gray-100 bg-white'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 ring-1  left-4 bg-orange-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                    Most popular
                  </span>
                )}
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{plan.name}</h3>
                <p className="text-xl font-bold text-gray-900 mb-4">{plan.price}</p>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheck className="text-orange-500 shrink-0 text-xs" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded text-sm font-medium transition-colors">
                  Select plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Locations ── */}
<section className="py-12 sm:py-16 px-6">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">Our locations</h2>
    <p className="text-sm text-gray-500 mb-8">Convenient pickup and drop-off points near you.</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {locations.map((loc) => (
        <div key={loc.id} className="border border-gray-200 rounded p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">{loc.name}</h3>
          <div className="text-xs text-gray-500 space-y-1 mb-3">
            <p>{loc.address}</p>
            <p>{loc.phone}</p>
            <p>{loc.hours}</p>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange-600 hover:underline inline-flex items-center gap-1"
          >
            Get directions
            <span className="text-orange-600">→</span>
          </a>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── How it works ── */}
      <section className="py-12 sm:py-16 px-6 bg-orange-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">How it works</h2>
          <p className="text-sm text-gray-500 mb-8">Rent a car in three simple steps.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: 1, title: 'Choose your car',  description: 'Browse our fleet and filter by type, price, or features to find the right fit.' },
              { step: 2, title: 'Book online',       description: 'Complete your booking securely. Add insurance or extras as needed.' },
              { step: 3, title: 'Pick up and drive', description: 'Collect your car from one of our locations. Everything is ready when you arrive.' },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 sm:py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Ready to hit the road?</h2>
          <p className="text-sm text-gray-500 mb-7">
            Book your rental today and enjoy reliable, hassle-free car hire across Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/vehicles')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-8 py-3 rounded text-sm transition-colors"
            >
              Rent now
            </button>
            <Link
              href="/contact"
              className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-8 py-3 rounded text-sm transition-colors text-center"
            >
              Contact us
            </Link>
          </div>
         
        </div>
      </section>

    </div>
  );
};

export default CarHireServices;