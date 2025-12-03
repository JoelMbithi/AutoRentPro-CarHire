'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar, FaShieldAlt, FaMapMarkerAlt, FaPhone, FaClock, FaCar, FaGasPump, FaUserFriends, FaCog, FaCreditCard, FaCheck, FaPlay, FaArrowRight } from 'react-icons/fa';
import { IoSpeedometer, IoLocationSharp, IoHeart, IoShieldCheckmark } from 'react-icons/io5';
import Link from 'next/link';

interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

const CarHireServices = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('cars');

  const handleCheckAvailability = () => {
    // Create search parameters object
    const searchParams = new URLSearchParams();
    
    if (pickupDate) searchParams.append('pickupDate', pickupDate);
    if (returnDate) searchParams.append('returnDate', returnDate);
    if (pickupLocation) searchParams.append('location', pickupLocation);
    if (selectedCategory && selectedCategory !== 'all') {
      searchParams.append('category', selectedCategory);
    }
    
    // Navigate to fleet page with search parameters
    router.push(`/vehicles?${searchParams.toString()}`);
  };

  const handleRentNow = () => {
    // Navigate to vehicles page without filters
    router.push('/vehicles');
  };

  // Service features with your orange color scheme
  const serviceFeatures: ServiceFeature[] = [
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25"><FaCar className="text-2xl text-white" /></div>,
      title: 'Wide Selection',
      description: 'Choose from 50+ economy to luxury vehicles for every need and budget. Regular fleet updates with latest models.'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25"><FaCreditCard className="text-2xl text-white" /></div>,
      title: 'Best Prices',
      description: 'Competitive rates with no hidden fees. Price match guarantee and special discounts for long-term rentals.'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25"><IoSpeedometer className="text-2xl text-white" /></div>,
      title: 'Instant Booking',
      description: 'Reserve your vehicle in minutes with our easy online system. Real-time availability and instant confirmation.'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25"><IoShieldCheckmark className="text-2xl text-white" /></div>,
      title: 'Full Insurance',
      description: 'Comprehensive coverage options including collision damage waiver and theft protection for complete peace of mind.'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25"><IoLocationSharp className="text-2xl text-white" /></div>,
      title: 'Multiple Locations',
      description: '15+ convenient pickup and drop-off points across the city including airport and downtown locations.'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25"><FaPhone className="text-2xl text-white" /></div>,
      title: '24/7 Support',
      description: 'Round-the-clock customer service and roadside assistance for any assistance needed during your rental period.'
    }
  ];

  // Locations
  const locations: Location[] = [
    {
      id: 1,
      name: 'Downtown Office',
      address: '123 Main Street, Downtown',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Sun: 6:00 AM - 11:00 PM'
    },
    {
      id: 2,
      name: 'Airport Terminal',
      address: 'Airport Boulevard, Terminal 2',
      phone: '+1 (555) 123-4568',
      hours: '24/7 Operation'
    },
    {
      id: 3,
      name: 'City Center',
      address: '456 Central Avenue',
      phone: '+1 (555) 123-4569',
      hours: 'Mon-Sun: 7:00 AM - 10:00 PM'
    },
    {
      id: 4,
      name: 'Business District',
      address: '789 Corporate Drive',
      phone: '+1 (555) 123-4570',
      hours: 'Mon-Fri: 6:00 AM - 9:00 PM'
    }
  ];

  // Insurance options
  const insuranceOptions = [
    {
      name: 'Basic Coverage',
      price: '$15/day',
      features: ['Liability Protection', 'Basic Theft Protection', '24/7 Customer Support'],
      description: 'Essential coverage for peace of mind',
      popular: false
    },
    {
      name: 'Premium Coverage',
      price: '$25/day',
      features: ['Full Collision Coverage', 'Theft Protection', 'Roadside Assistance', 'Zero Deductible'],
      description: 'Comprehensive protection',
      popular: true
    },
    {
      name: 'Platinum Coverage',
      price: '$35/day',
      features: ['Zero Deductible', 'Personal Accident Insurance', '24/7 Concierge', 'Trip Interruption'],
      description: 'Ultimate peace of mind',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Enhanced Hero Section with your gradient */}
      <section className="relative text-white py-24 overflow-hidden bg-cover bg-center" 
        style={{ backgroundImage: "url('/Service.png')" }}>
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                AutoRent Pro Car Rental
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-400">Experience</span>
              </h1>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Discover the perfect vehicle for your journey. From economy to luxury, 
                we have the right car for every adventure.
              </p>
            </div>
            
            {/* Enhanced Booking Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-white text-sm font-semibold mb-3 flex items-center gap-2">
                    <IoLocationSharp className="text-orange-300" />
                    Pick-up Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-white placeholder-white/70"
                  >
                    <option value="" className="text-gray-800">Select Location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.name} className="text-gray-800">
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-3">Pick-up Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-3">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleCheckAvailability}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaCar className="text-lg" />
                    Check Availability
                  </button>
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="mt-6">
                <label className="block text-white text-sm font-semibold mb-3">Car Category</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'all', label: 'All Cars' },
                    { value: 'ECONOMY', label: 'Economy' },
                    { value: 'SUV', label: 'SUV' },
                    { value: 'LUXURY', label: 'Luxury' },
                    { value: 'SPORTS', label: 'Sports' },
                    { value: 'COMPACT', label: 'Compact' },
                    { value: 'MIDSIZE', label: 'Midsize' },
                    { value: 'FULLSIZE', label: 'Fullsize' }
                  ].map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                        selectedCategory === category.value
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/20">
                {[
                  { number: '5,000+', label: 'Happy Customers' },
                  { number: '50+', label: 'Vehicles' },
                  { number: '15+', label: 'Locations' },
                  { number: '24/7', label: 'Support' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-3xl font-bold text-orange-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent mb-4">
              Why Choose AutoRentPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide exceptional service with a focus on reliability, convenience, and customer satisfaction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="group p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-orange-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center group-hover:text-orange-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Insurance Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent mb-4">
              Insurance Options
            </h2>
            <p className="text-xl text-gray-600">Choose the protection that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {insuranceOptions.map((insurance, index) => (
              <div 
                key={index} 
                className={`relative rounded-3xl p-8 backdrop-blur-sm border-2 transition-all duration-500 hover:-translate-y-4 ${
                  insurance.popular 
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-2xl scale-105 border-orange-500' 
                    : 'bg-white/80 border-gray-200 hover:border-orange-300 shadow-lg hover:shadow-xl'
                }`}
              >
                {insurance.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <h3 className={`text-2xl font-bold mb-2 ${insurance.popular ? 'text-white' : 'text-gray-800'}`}>
                  {insurance.name}
                </h3>
                <div className={`text-4xl font-bold mb-4 ${insurance.popular ? 'text-yellow-400' : 'text-orange-600'}`}>
                  {insurance.price}
                </div>
                <p className={`mb-6 ${insurance.popular ? 'text-orange-100' : 'text-gray-600'}`}>
                  {insurance.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {insurance.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-center gap-3 ${
                      insurance.popular ? 'text-white' : 'text-gray-700'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        insurance.popular ? 'bg-orange-400' : 'bg-orange-100'
                      }`}>
                        <FaCheck className={`text-xs ${insurance.popular ? 'text-white' : 'text-orange-600'}`} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  insurance.popular 
                    ? 'bg-white text-orange-600 hover:bg-gray-100 shadow-lg' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg'
                }`}>
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Locations Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-orange-600 bg-clip-text text-transparent mb-4">
              Our Locations
            </h2>
            <p className="text-xl text-gray-600">Convenient pickup and drop-off points</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {locations.map(location => (
              <div 
                key={location.id} 
                className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-gray-100 hover:border-orange-300 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                    {location.name}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{location.address}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FaPhone className="text-orange-600 text-sm" />
                    </div>
                    <span className="font-medium">{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FaClock className="text-orange-600 text-sm" />
                    </div>
                    <span className="font-medium">{location.hours}</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  Get Directions
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* Enhanced How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Rent a car in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: 'Choose Your Car',
                description: 'Select from our wide range of vehicles that suit your needs and budget. Filter by type, price, and features.',
                icon: '🚗'
              },
              {
                step: 2,
                title: 'Book Online',
                description: 'Complete your reservation with our secure online booking system. Add insurance and additional services.',
                icon: '📱'
              },
              {
                step: 3,
                title: 'Pick Up & Drive',
                description: 'Collect your vehicle from our convenient locations with all paperwork ready. Hit the road in minutes.',
                icon: '🎯'
              }
            ].map((step, index) => (
              <div key={index} className="text-center group relative">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-2xl shadow-orange-500/25 group-hover:scale-110 transition-all duration-500">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-orange-600 font-bold border-2 border-orange-500">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 translate-y-32"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Hit the Road?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
              Book your perfect rental car today and enjoy a seamless experience from start to finish. 
              Join 5,000+ satisfied customers who trust AutoRentPro.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={handleRentNow}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center gap-3"
              >
                <FaCar className="text-lg" />
                Rent Now
                <FaArrowRight className="text-sm" />
              </button>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                Contact Us
              </Link>
            </div>
            <div className="mt-8 text-white/80">
              <p className="flex items-center justify-center gap-2 text-lg">
                <FaPhone className="text-orange-300" />
                Call us at <strong className="text-white ml-1">+(254) 743 861 565</strong> for immediate assistance
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarHireServices;