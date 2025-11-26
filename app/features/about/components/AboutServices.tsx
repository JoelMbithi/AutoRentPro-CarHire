import Image from 'next/image'
import React from 'react'

const AboutServices = () => {
  return (
    <div className='flex flex-col px-4 sm:px-8 lg:px-12 py-16 bg-white'>
      {/* top Section */}
      <div className='flex flex-col md:flex-row items-center justify-between gap-8 mb-16'>
        <div>
            <Image 
              src="/discussion1.png" 
              alt="discussion" 
              width={600} 
              height={600} 
              className="rounded"
            />
        </div>
        
        {/* left section */}
        <div className='flex flex-col gap-6 max-w-2xl'>
            <h1 className='font-bold text-orange-500 text-lg'>OUR SERVICES</h1>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight'>
              Our Service Your <span className='text-orange-500'>Satisfaction</span>
            </h2>
            <p className='text-lg text-gray-600 leading-relaxed'>
              We provide comprehensive car rental services tailored to your needs. 
              Experience premium vehicles with exceptional customer service for every occasion.
            </p>

            <div className='flex flex-col gap-6'>
                <div className='flex flex-col sm:flex-row gap-4'>
                    <p className='text-black font-bold text-lg bg-orange-50 px-6 py-4 rounded-xl border-l-4 border-orange-500 w-full'>
                      One-Day Car Rental
                    </p>
                    <p className='text-black font-bold text-lg bg-blue-50 px-6 py-4 rounded-xl border-l-4 border-blue-500 w-full'>
                      Meetings and Groups
                    </p>
                </div>
                 <div className='flex flex-col sm:flex-row gap-4'>
                    <p className='text-black font-bold text-lg bg-green-50 px-6 py-4 rounded-xl border-l-4 border-green-500 w-full'>
                      Long Term Car Rental
                    </p>
                    <p className='text-black font-bold text-lg bg-purple-50 px-6 py-4 rounded-xl border-l-4 border-purple-500 w-full'>
                      Weekend Car Rental
                    </p>
                </div>
                <button className='bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-fit mt-4'>
                  See all services
                </button>
            </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className='flex flex-col md:flex-row gap-8 items-start'>
        <div className='flex-1'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight'>
              Meet <br /> 
              <span className='text-orange-500'>Our Agents</span>
            </h1>
            <p className='text-gray-600 mt-4 text-lg max-w-sm'>
              Our dedicated team is here to provide you with personalized service and expert guidance.
            </p>
        </div>

        <div className='flex-1 flex flex-col md:flex-row gap-6  rounded-2xl p-6 border border-orange-200 '>
            {/* agent */}
            <div className='flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300'>
                <p className='text-gray-600 italic text-lg'>"Our commitment to excellence ensures every client gets premium service."</p>
                <div className='flex flex-row gap-4 items-center'>
                    <Image 
                      src="/Profiles/joe.jpeg" 
                      alt="joe" 
                      width={60} 
                      height={60} 
                      className="rounded-full object-cover border-2 border-orange-500"
                    />
                    <div className='flex flex-col'>
                        <h1 className='font-bold text-gray-900 text-lg'>Joel Mbithi</h1>
                        <h1 className='text-orange-500 font-semibold'>Manager</h1>
                    </div>
                </div>
            </div>

            {/* agent */}
            <div className='flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300'>
                <p className='text-gray-600 italic text-lg'>"I specialize in finding the perfect vehicle for your specific needs."</p>
                <div className='flex flex-row gap-4 items-center'>
                    <Image 
                      src="/Profiles/joe.jpeg" 
                      alt="joe" 
                      width={60} 
                      height={60} 
                      className="rounded-full object-cover border-2 border-orange-500"
                    />
                    <div className='flex flex-col'>
                        <h1 className='font-bold text-gray-900 text-lg'>Sarah Johnson</h1>
                        <h1 className='text-orange-500 font-semibold'>Senior Agent</h1>
                    </div>
                </div>
            </div>

            {/* agent */}
            <div className='flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300'>
                <p className='text-gray-600 italic text-lg'>"Your satisfaction is our top priority for a seamless rental experience."</p>
                <div className='flex flex-row gap-4 items-center'>
                    <Image 
                      src="/Profiles/joe.jpeg" 
                      alt="joe" 
                      width={60} 
                      height={60} 
                      className="rounded-full object-cover border-2 border-orange-500"
                    />
                    <div className='flex flex-col'>
                        <h1 className='font-bold text-gray-900 text-lg'>Mike Chen</h1>
                        <h1 className='text-orange-500 font-semibold'>Customer Relations</h1>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AboutServices