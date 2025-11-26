
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaStar, FaShieldAlt, FaMapMarkerAlt, FaPhone, FaClock, FaCar, FaGasPump, FaUserFriends, FaCog, FaCreditCard } from 'react-icons/fa';
import { IoSpeedometer, IoLocationSharp } from 'react-icons/io5';



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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('cars');

 

  // Service features with icons
  const serviceFeatures: ServiceFeature[] = [
    {
      icon: <FaCar className="text-3xl text-orange-600" />,
      title: 'Wide Selection',
      description: 'Choose from 50+ economy to luxury vehicles for every need and budget. Regular fleet updates with latest models.'
    },
    {
      icon: <FaCreditCard className="text-3xl text-orange-600" />,
      title: 'Best Prices',
      description: 'Competitive rates with no hidden fees. Price match guarantee and special discounts for long-term rentals.'
    },
    {
      icon: <IoSpeedometer className="text-3xl text-orange-600" />,
      title: 'Instant Booking',
      description: 'Reserve your vehicle in minutes with our easy online system. Real-time availability and instant confirmation.'
    },
    {
      icon: <FaShieldAlt className="text-3xl text-orange-600" />,
      title: 'Full Insurance',
      description: 'Comprehensive coverage options including collision damage waiver and theft protection for complete peace of mind.'
    },
    {
      icon: <IoLocationSharp className="text-3xl text-orange-600" />,
      title: 'Multiple Locations',
      description: '15+ convenient pickup and drop-off points across the city including airport and downtown locations.'
    },
    {
      icon: <FaPhone className="text-3xl text-orange-600" />,
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
      features: ['Liability Protection', 'Basic Theft Protection'],
      description: 'Essential coverage for peace of mind'
    },
    {
      name: 'Premium Coverage',
      price: '$25/day',
      features: ['Full Collision Coverage', 'Theft Protection', 'Roadside Assistance'],
      description: 'Comprehensive protection'
    },
    {
      name: 'Platinum Coverage',
      price: '$35/day',
      features: ['Zero Deductible', 'Personal Accident Insurance', '24/7 Concierge'],
      description: 'Ultimate peace of mind'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-purple-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">AutoRentPro Car Rental Services</h1>
            <p className="text-xl mb-8 opacity-90">
              Discover the perfect vehicle for your journey. From economy to luxury, 
              we have the right car for every adventure. Serving customers since 2010.
            </p>
            
            {/* Enhanced Booking Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
                    Pick-up Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 text-left">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
                  />
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
                    Check Availability
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">5,000+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">50+</div>
                  <div className="text-sm text-gray-600">Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">15+</div>
                  <div className="text-sm text-gray-600">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose AutoRentPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide exceptional service with a focus on reliability, convenience, and customer satisfaction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Insurance Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Insurance Options</h2>
            <p className="text-xl text-gray-600">Choose the protection that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {insuranceOptions.map((insurance, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition duration-300 border-2 border-transparent hover:border-orange-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{insurance.name}</h3>
                <div className="text-3xl font-bold text-orange-600 mb-4">{insurance.price}</div>
                <p className="text-gray-600 mb-6">{insurance.description}</p>
                <ul className="space-y-3 mb-6">
                  {insurance.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition duration-300">
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Locations</h2>
            <p className="text-xl text-gray-600">Convenient pickup and drop-off points</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map(location => (
              <div key={location.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <FaMapMarkerAlt className="text-orange-600 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-800">{location.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{location.address}</p>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FaPhone className="text-orange-500" />
                  <span>{location.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock className="text-orange-500" />
                  <span>{location.hours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Rent a car in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 group-hover:scale-110 transition duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Choose Your Car</h3>
              <p className="text-gray-600">Select from our wide range of vehicles that suit your needs and budget. Filter by type, price, and features.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 group-hover:scale-110 transition duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Book Online</h3>
              <p className="text-gray-600">Complete your reservation with our secure online booking system. Add insurance and additional services.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 group-hover:scale-110 transition duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Pick Up & Drive</h3>
              <p className="text-gray-600">Collect your vehicle from our convenient locations with all paperwork ready. Hit the road in minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your perfect rental car today and enjoy a seamless experience from start to finish. 
            Join 5,000+ satisfied customers who trust AutoRentPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg">
              Book Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
              Contact Us
            </button>
          </div>
          <div className="mt-8 text-orange-100">
            <p>📞 Call us at <strong>+1 (555) 123-4567</strong> for immediate assistance</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarHireServices;