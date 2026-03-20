import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AboutServices = () => {
  return (
    <div className='bg-white'>

      {/* ── Top section ── */}
      <div className='flex flex-col md:flex-row items-center'>

        {/* Image */}
        <div className='relative w-full px-12 md:w-1/2 h-72 md:h-[480px] shrink-0 overflow-hidden'>
          <Image
            src="/discussion1.png"
            alt="discussion"
            width={800}
            height={560}
            className="rounded"
          />
        </div>

        {/* Text */}
        <div className='flex flex-col gap-4 px-8 sm:px-12 py-12 md:w-1/2'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 leading-snug'>
            Our service,<br />your satisfaction.
          </h2>

          <p className='text-gray-500 text-sm leading-relaxed max-w-sm'>
            Premium vehicles and reliable support — from a single day to long-term arrangements, no hidden fees, no surprises.
          </p>

          {/* Service list */}
          <ul className='grid grid-cols-2 gap-2 mt-1'>
            {[
              'One-Day Rental',
              'Meetings & Groups',
              'Long-Term Rental',
              'Weekend Rental',
            ].map((label) => (
              <li
                key={label}
                className='text-sm text-gray-700 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded'
              >
                {label}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className='flex gap-3 mt-1'>
            <Link
              href="/vehicles"
              className='text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded transition-colors'
            >
              Find Your Car
            </Link>
            <Link
              href="/services"
              className='text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded transition-colors'
            >
              All Services
            </Link>
          </div>
        </div>
      </div>

      {/* ── Agents section ── */}
      <div className='px-8 sm:px-12 py-10 mt-16 border-t border-gray-200'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-1'>Meet our agents</h2>
          <p className='text-gray-400 text-sm'>People who make your rental experience hassle-free.</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[
            {
              quote: 'Making sure every client gets the care they deserve.',
              name: 'Joel Mbithi',
              role: 'Manager',
              img: '/Profiles/joe.jpeg',
            },
            {
              quote: 'Helping you find the right vehicle for your specific needs.',
              name: 'Sarah Johnson',
              role: 'Senior Agent',
              img: '/Profiles/joe.jpeg',
            },
            {
              quote: 'Here to make your experience smooth from start to finish.',
              name: 'Mike Chen',
              role: 'Customer Relations',
              img: '/Profiles/joe.jpeg',
            },
          ].map((agent) => (
            <div
              key={agent.name}
              className='flex flex-col gap-3 p-5 border border-gray-200 rounded'
            >
              <p className='text-gray-500 text-sm leading-relaxed'>"{agent.quote}"</p>
              <div className='flex items-center gap-3 mt-auto pt-3 border-t border-gray-100'>
                <Image
                  src={agent.img}
                  alt={agent.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover shrink-0"
                />
                <div>
                  <p className='font-medium text-gray-900 text-sm'>{agent.name}</p>
                  <p className='text-gray-400 text-xs mt-0.5'>{agent.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AboutServices