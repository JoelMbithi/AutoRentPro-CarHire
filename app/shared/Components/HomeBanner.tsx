import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LandingBanner = () => {
  return (
    <div className="flex flex-col md:flex-row justify-betwee items-center py-16 mx-auto gap-0">
      
      {/* Left Section - Text */}
      <div className="flex flex-col gap-5 justify-center px-8 md:px-16 max-w-xl">

        {/* eyebrow */}
        <div className="flex items-center gap-3">
          <span className="block w-8 h-px bg-orange-600" />
          <span className="text-orange-600 text-xs font-semibold tracking-widest uppercase">
            Kenya's Trusted Car Rental
          </span>
        </div>

        <h1 className="font-bold text-5xl md:text-6xl text-black leading-tight">
          The right car,<br />
          at the right <span className="text-orange-600">price.</span>
        </h1>

        <p className="text-sm md:text-lg text-gray-500 leading-relaxed max-w-sm">
          Browse AutoRentPro's growing fleet across Kenya — daily, weekly, 
          or monthly. No hidden fees, no surprises.
        </p>

        {/* trust line */}
        <div className="flex items-center gap-6 text-xs text-gray-400 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Fully insured
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Free cancellation
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            24/7 support
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/vehicles"
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-8 py-4 rounded-none transition-colors duration-300 shadow-md tracking-wide text-center"
          >
            Find Your Car
          </Link>
          <button className="border border-gray-200 hover:border-orange-600 text-gray-500 hover:text-orange-600 text-sm font-semibold px-8 py-4 rounded-none transition-all duration-300 tracking-wide">
            How It Works
          </button>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:flex relative w-200 h-80 md:h-[520px] md:flex-1">
        <Image
          src="/Homebanner.png"
          alt="AutoRentPro car rental Kenya"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* subtle left fade blend */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none hidden md:block" />
      </div>

    </div>
  )
}

export default LandingBanner