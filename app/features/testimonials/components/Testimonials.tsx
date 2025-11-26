"use client";
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Christine Mutheu",
      role: "Business Executive",
      rating: 5,
      text: "AutoRentPro made my business trip incredibly smooth. The Mercedes E-Class was pristine, and the delivery service saved me hours.",
      profileImage: "/Profiles/christine.jpeg"
    },
    {
      id: 2,
      name: "Joel Mbithi",
      role: "Luxury Traveler",
      rating: 5,
      text: "I've rented luxury cars worldwide, but AutoRentPro stands out. Their attention to detail and customer service is exceptional.",
      profileImage: "/Profiles/Joe.jpeg"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Wedding Planner",
      rating: 5,
      text: "For our high-profile wedding clients, only AutoRentPro delivers the quality and reliability we need.",
      profileImage: "/Profiles/emily.jpg" 
    }
  ];

  return (
    <div className='flex flex-col gap-12 py-16 px-4 bg-gray-50'>
      {/* Top Section */}
      <div className='flex flex-col items-center justify-center text-center'>
        <h1 className='font-bold text-3xl sm:text-4xl text-gray-900 mb-4'>
          What Our <span className='text-orange-600'>Clients</span> Say
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl'>
          Don't just take our word for it. Here's what our valued customers have to say.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full'>
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className='flex flex-col bg-white rounded-xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-300'
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className='text-yellow-400 text-lg'>★</span>
              ))}
            </div>
            
            {/* Text */}
            <p className='text-gray-700 leading-relaxed mb-6 flex-1'>
              "{testimonial.text}"
            </p>
            
            {/* Client Info with Profile Image */}
            <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={testimonial.profileImage} 
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                   /*  // Fallback to initials if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex'; */
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold hidden">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div>
                <h3 className='font-bold text-gray-900'>{testimonial.name}</h3>
                <p className='text-gray-600 text-sm'>{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;