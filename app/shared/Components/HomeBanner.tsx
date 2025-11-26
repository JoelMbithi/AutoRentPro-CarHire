import Image from 'next/image'
import React from 'react'

const LandingBanner = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center px- py-16 mx-auto gap-8">
      
      {/* Left Section - Textual Content */}
      <div className="flex flex-col gap-4 justify-center px-8 max-w-xl">
        <h1 className="font-bold text-5xl md:text-6xl text-black">
          Looking to save more <br /> on your rental car?
        </h1>
        <p className="text-xs md:text-xl text-gray-700">
          Discover AutoRentPro car rental options in Kenya with Rent a Car.
          <br /> Select from a range of car options and local specials.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-2 py-4 rounded-lg transition-colors duration-300 shadow-lg">
            Find Your Perfect Car
          </button>
          <button className="border border-gray-300 hover:border-orange-600 text-gray-700 hover:text-orange-600 font-semibold px-8 py-4 rounded-lg transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>

      {/* Right Section - Full Width Image */}
      <div className="relative w-full  h-80 md:h-120 ">
        <Image
          src="/Homebanner.png"
          alt="AutoRentPro car"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    </div>
  )
}

export default LandingBanner
