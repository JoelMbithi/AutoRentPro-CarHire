"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const FleetBanner = () => {
  const router = useRouter();
  const [carModel, setCarModel] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = new URLSearchParams();
    
    if (carModel) searchParams.append('search', carModel);
    if (category) searchParams.append('category', category.toUpperCase());
    
    router.push(`/vehicles?${searchParams.toString()}`);
  };

  return (
    <div
      className="min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] 
      w-full flex flex-col lg:flex-row items-center justify-between 
      px-4 sm:px-8 lg:px-20 py-8 
      bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/display1.png')" }}
    >
      {/* Background Overlay */}
      <div className='absolute inset-0 bg-black/20 z-0'></div>
      
      {/* Left Side Text */}
      <div className='flex flex-col text-white z-10 max-w-md mb-8 lg:mb-0 text-center lg:text-left'>
        <h1 className='font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4'>
          Find Your Dream Car
        </h1>
        
        <div className='w-16 h-1 bg-orange-500 mb-4 mx-auto lg:mx-0 rounded-full'></div>
        
        <p className='text-base sm:text-lg text-gray-200 leading-relaxed'>
          Our <span className='text-orange-400 font-semibold'>AutoRentPro</span> experts inspect the car so you get complete satisfaction and peace.
        </p>
      </div>

      {/* Right Side Search Form */}
      <div className='bg-white rounded-xl shadow-xl p-6 z-10 w-full max-w-sm'>
        <div className='text-center mb-4'>
          <h1 className='text-xl font-bold text-gray-900'>
            <span className='text-orange-600'>5000</span> cars to hire
          </h1>
        </div>

        <form onSubmit={handleSearch} className='space-y-4'>
          {/* Car Model */}
          <div className='space-y-2'>
            <h1 className='text-black font-semibold text-sm'>Car Model</h1>
            <input 
              type="text" 
              placeholder='Search a car model' 
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm'
            />
          </div>

          {/* Category */}
          <div className='space-y-2'>
            <h1 className='text-black font-semibold text-sm'>Category</h1>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white'
            >
              <option value="">Select category</option>
              <option value="luxury">Luxury</option>
              <option value="suv">SUV</option>
              <option value="sports">Sports</option>
              <option value="electric">Electric</option>
              <option value="economy">Economy</option>
              <option value="compact">Compact</option>
              <option value="midsize">Midsize</option>
              <option value="fullsize">Fullsize</option>
            </select>
          </div>

          {/* Search Button */}
          <button 
            type="submit"
            className='w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300'
          >
            Search Cars
          </button>
        </form>
      </div>
    </div>
  )
}

export default FleetBanner;