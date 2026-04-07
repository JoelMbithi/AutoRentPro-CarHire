import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const services = [
  {
    title: 'Daily Hire',
    desc: 'Need a car for a day? Pick up in the morning, return by close of business. Ideal for errands, airport transfers, or day trips out of Nairobi.',
  },
  {
    title: 'Weekly & Monthly Hire',
    desc: 'Longer stays or extended projects? Weekly and monthly rates offer better value with the same level of service and support throughout.',
  },
  {
    title: 'Corporate Hire',
    desc: 'We work with businesses that need reliable transport for staff, clients, or site visits. Invoicing and account arrangements available.',
  },
  {
    title: 'Airport Transfers',
    desc: 'Pre-booked vehicles available for JKIA and Wilson Airport pickups and drop-offs. Your driver will be ready when your flight lands.',
  },
  {
    title: 'Upcountry Travel',
    desc: 'Heading outside Nairobi? We have 4WDs and larger vehicles suited for long-distance travel and rougher roads. Cross-border options available on request.',
  },
  {
    title: 'Self-Drive',
    desc: 'Present your valid licence, pay the deposit, and go. All self-drive vehicles come with third-party insurance, CDW, and 24/7 breakdown cover.',
  },
]

const AboutServices = () => {
  return (
    <div className="bg-white">

      {/* Top — image + intro */}
      <div className="flex flex-col md:flex-row items-stretch">

        {/* Image */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[400px] shrink-0 overflow-hidden">
          <Image
            src="/discussion1.png"
            alt="AutoRentPro customer service team"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center gap-5 px-8 sm:px-12 py-12 md:w-1/2 bg-gray-50">
          <p className="text-xs text-orange-500 font-medium uppercase tracking-wider">About AutoRentPro</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Hire options for every<br />journey and budget.
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
            Whether you need a car for a few hours or a few months, we have a hire
            arrangement that fits. All vehicles are fully insured and maintained
            to a consistent standard.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/vehicles"
              className="px-6 py-2.5 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors"
            >
              Browse Fleet
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              Make an Enquiry
            </Link>
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="px-4 bg-orange-50 sm:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-orange-500 text-sm font-medium mb-2">What We Offer</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Our Rental Services
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Flexible hire solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-white border border-gray-100 rounded p-6 hover:border-orange-300  transition-shadow">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-0 px-8 sm:px-12 py-4 borde border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs md:text-sm text-gray-600">
              Not sure which option suits you?{' '}
              <Link href="/contact" className="text-orange-500 font-medium hover:text-orange-600 underline underline-offset-2">
                Talk to us
              </Link>{' '}
              and we'll find the right arrangement.
            </p>
          </div>
          
        </div>
      </div>

    </div>
  )
}

export default AboutServices