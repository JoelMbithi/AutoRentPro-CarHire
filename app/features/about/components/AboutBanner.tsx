import Link from 'next/link';
import React from 'react';

const AboutBanner = () => {
  return (
    <div
      className='min-h-[60vh] flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 py-28 bg-cover bg-center bg-no-repeat relative'
      style={{ backgroundImage: "url('/dashboard.jpg')" }}
    >
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/60 z-0' />

      {/* Text */}
      <div className='relative z-10 max-w-2xl text-white flex flex-col gap-4'>
        <h1 className='text-4xl sm:text-5xl font-bold leading-tight'>
          About <span className='text-orange-500'>AutoRentPro</span>
        </h1>

        <p className='text-lg text-gray-200'>
          Your trusted partner for seamless, affordable car rentals.
          We offer a wide variety of well-maintained vehicles for every occasion.
        </p>

        <p className='text-gray-300 text-sm leading-relaxed'>
          Whether you need a compact car for daily errands or something bigger for a special trip,
          we've got you covered — with straightforward pricing and reliable service.
        </p>

        <div className='flex gap-3 mt-2'>
          <Link
            href="/vehicles"
            className='px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors'
          >
            Explore Fleet
          </Link>
          <Link
            href="/contact"
            className='px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium rounded-lg transition-colors'
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Side image */}
      <div className='relative z-10 hidden lg:flex'>
        <img
          src="/car1.png"
          alt="AutoRentPro vehicle"
          className='w-[400px] rounded-xl'
        />
      </div>
    </div>
  );
};

export default AboutBanner;