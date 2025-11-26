import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className='bg-white border-t border-gray-200'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 md:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
          {/* Brand Section */}
          <div className='lg:col-span-2 flex flex-col gap-4'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent'>
              AutoRentPro
            </h1>
            <p className='text-gray-600 leading-relaxed max-w-md'>
              Experience luxury redefined with our premium car rental service. 
              Where exceptional vehicles meet unparalleled service for your journey.
            </p>
            <div className='flex gap-4'>
              {[  <FaFacebookF className=''/>,
                <FaTwitter />,
                <FaInstagram />,
                <FaLinkedinIn />,].map((icon, index) => (
                            <div 
                  key={index}
                  className='bg-gray-100 text-orange-500 hover:bg-orange-500 hover:text-white p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-110'
                >
                  <span className='text-lg'>{icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className='flex flex-col gap-4'>
            <h1 className='text-xl font-bold text-gray-900'>About AutoRentPro</h1>
            <div className='flex flex-col gap-3'>
              {['Why AutoRentPro', 'Our Story', 'Investor Relations', 'Press Center', 'Advertise'].map((item) => (
                <a 
                  key={item}
                  href='#' 
                  className='text-gray-600 hover:text-orange-500 transition-colors duration-300 text-sm cursor-pointer'
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className='flex flex-col gap-4'>
            <h1 className='text-xl font-bold text-gray-900'>Resources</h1>
            <div className='flex flex-col gap-3'>
              {['Download', 'Help Center', 'Guides', 'Developers', 'Mechanics'].map((item) => (
                <a 
                  key={item}
                  href='#' 
                  className='text-gray-600 hover:text-orange-500 transition-colors duration-300 text-sm cursor-pointer'
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Extras & Newsletter */}
          <div className='flex flex-col gap-4'>
            <h1 className='text-xl font-bold text-gray-900'>Extras</h1>
            <div className='flex flex-col gap-3 mb-4'>
              {['Rental Deals', 'Repair Shop', 'View Booking', 'Hire Companies', 'New Offers'].map((item) => (
                <a 
                  key={item}
                  href='#' 
                  className='text-gray-600 hover:text-orange-500 transition-colors duration-300 text-sm cursor-pointer'
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className='flex flex-col gap-3'>
              <h1 className='text-xl font-bold text-gray-900'>Newsletter</h1>
              <p className='text-gray-600 text-sm'>
                Subscribe for special offers
              </p>
              <div className='flex flex-col sm:flex-row gap-2'>
                <input 
                  type="email" 
                  placeholder='Email Address' 
                  className='flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500 text-sm'
                />
                <button className='bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 text-sm whitespace-nowrap'>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-gray-200 mt-8 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='text-gray-500 text-sm'>
              © 2025 AutoRentPro. All rights reserved.
            </div>
            <div className='flex gap-6 text-sm'>
              {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map((item) => (
                <a 
                  key={item}
                  href='#' 
                  className='text-gray-500 hover:text-orange-500 transition-colors duration-300 cursor-pointer'
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer