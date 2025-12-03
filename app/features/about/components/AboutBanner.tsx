import Link from 'next/link';
import React from 'react';

const AboutBanner = () => {
  return (
    <div
      className='min-h-[60vh] flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 py-16 bg-cover bg-center bg-no-repeat relative'
      style={{ backgroundImage: "url('/dashboard.jpg')" }}
    >
      {/* Background Overlay */}
      <div className='absolute inset-0 bg-black/60 z-0'></div>
      

      {/* Text Section */}
      <div className='relative z-10 max-w-2xl text-white flex flex-col gap-4'>
        <h1 className='text-4xl sm:text-5xl font-bold leading-tight'>
          About <span className='text-orange-500'>AutoRentPro</span>
        </h1>

        <p className='text-lg sm:text-xl text-gray-200'>
          Your trusted partner for seamless, affordable, and   AutoRent Pro car rentals.  
          We provide a wide variety of well-maintained vehicles suited for every occasion.
        </p>

        <p className='text-gray-300'>
          Whether you need a compact ride for daily errands or a luxury car for special events,  
          AutoRentPro ensures comfort, safety, and exceptional customer service.
        </p>

        <div className='flex gap-4 mt-4'>
          <Link href={"/vehicles"} className='px-6 py-3 bg-orange-500 rounded-lg font-medium hover:bg-orange-600 transition'>
            Explore Fleet
          </Link>
           <Link href={"/contact"} className='px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition'>
            Contact Us
         </Link>
        </div>
      </div>

      {/* Side Image / Optional Section */}
      <div className='relative z-10 hidden lg:flex'>
        <img
          src="/car1.png"
          alt="About AutoRentPro"
          className='w-[420px] drop-shadow-2xl rounded-xl'
        />
      </div>
    </div>
  );
};

export default AboutBanner;
