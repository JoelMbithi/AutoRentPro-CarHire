import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AboutServices = () => {
  return (
    <div className='bg-white'>

      {/* ── Top section ── */}
      <div className='flex flex-col md:flex-row items-center gap-0'>

        {/* Image with right-side fade */}
        <div className='relative w-full px-12 md:w-1/2 h-72 md:h-[480px] shrink-0 overflow-hidden'>
           <Image
            src="/discussion1.png"
            alt="discussion"
            width={800}
            height={560}
            className="rounde"
          />
         
        </div>

        {/* Text */}
        <div className='flex flex-col gap-4 px-8 sm:px-12 py-12 md:w-1/2'>
          {/* eyebrow */}
          <span className='text-xs font-semibold text-orange-500 uppercase tracking-widest'>
            Our Services
          </span>

          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 leading-snug'>
            Our service,<br />your satisfaction.
          </h2>

          <p className='text-gray-500 text-sm leading-relaxed max-w-sm'>
            Premium vehicles and reliable support — from a single day to long-term arrangements, no hidden fees, no surprises.
          </p>

          {/* trust line — mirrors LandingBanner */}
          <div className='flex flex-wrap gap-3 text-xs text-gray-500'>
            <span className='flex items-center gap-1.5'>
              <span className='w-1.5 h-1.5 rounded-full bg-orange-500' />
              Fully insured
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='w-1.5 h-1.5 rounded-full bg-orange-500' />
              Free cancellation
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='w-1.5 h-1.5 rounded-full bg-orange-500' />
              24/7 support
            </span>
          </div>

          {/* Service tags */}
          <ul className='grid grid-cols-2 gap-2 mt-1'>
            {[
              { label: 'One-Day Rental',    color: 'border-orange-400' },
              { label: 'Meetings & Groups', color: 'border-blue-400'   },
              { label: 'Long-Term Rental',  color: 'border-green-400'  },
              { label: 'Weekend Rental',    color: 'border-purple-400' },
            ].map(({ label, color }) => (
              <li
                key={label}
                className={`text-sm text-gray-700 font-medium bg-gray-50 border-l-2 ${color} px-4 py-2.5 rounded-r-lg`}
              >
                {label}
              </li>
            ))}
          </ul>

          {/* CTAs — mirrors LandingBanner two-button pattern */}
          <div className='flex gap-3 mt-1'>
            <Link
              href="/vehicles"
              className='text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-lg transition-colors'
            >
              Find Your Car
            </Link>
            <Link
              href="/services"
              className='text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-lg transition-colors'
            >
              All Services
            </Link>
          </div>
        </div>
      </div>

      {/* ── Agents section ── */}
      <div className='px-8 sm:px-12 py-10 mt-20 border-t border-gray-200'>
        <div className='flex flex-col justify-betwee gap-2 mb-6'>
          <div className='flex flex-col'>
            {/* eyebrow */}
            <span className='text-xs font-semibold text-orange-500 uppercase tracking-widest'>
              The Team
            </span>
            <h2 className='text-2xl font-bold text-gray-900 mt-1'>Meet our agents</h2>
          </div>
          <p className='text-gray-400 text-sm max-w-xs'>
            People who make your rental experience hassle-free.
          </p>
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
              className='flex flex-col gap-3 p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-orange-200 hover:bg-orange-50 transition-colors'
            >
              <p className='text-gray-500 text-sm leading-relaxed'>"{agent.quote}"</p>
              <div className='flex items-center gap-3 mt-auto pt-3 border-t border-gray-200'>
                <Image
                  src={agent.img}
                  alt={agent.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                />
                <div>
                  <p className='font-semibold text-gray-900 text-sm'>{agent.name}</p>
                  <p className='text-orange-500 text-xs mt-0.5'>{agent.role}</p>
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