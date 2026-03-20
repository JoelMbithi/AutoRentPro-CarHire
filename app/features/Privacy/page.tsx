'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const router = useRouter()
  return (
    <div className='flex flex-col px-4 py-4 items-center  bg-gray-50'>
      <div className='flex flex-col w-full max-w-3xl bg-white rounded-lg border border-gray-100'>
        
        {/* Header */}
        <div className='px-6 py-5 border-b border-gray-200'>
          <h1 className='text-xs text-gray-400 tracking-wider mb-1'>PRIVACY</h1>
          <h2 className='text-xl font-semibold text-gray-800'>Privacy Policy</h2>
        </div>

        {/* Content */}
        <div className='px-6 py-5 space-y-4'>
          
          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Information We Collect</h3>
            <p className='text-xs text-gray-600'>Name, email, phone number, driver's license details, and payment information when you make a booking.</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>How We Use Your Information</h3>
            <p className='text-xs text-gray-600'>To process your rental, verify your identity, communicate about your booking, and improve our services.</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Data Protection</h3>
            <p className='text-xs text-gray-600'>We use secure encryption to protect your personal information. We do not sell your data to third parties.</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Booking Records</h3>
            <p className='text-xs text-gray-600'>Rental history and vehicle usage data is stored for 3 years as required by law.</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Your Rights</h3>
            <p className='text-xs text-gray-600'>You can request a copy of your data or ask us to delete it by contacting support.</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Contact</h3>
            <p className='text-xs text-gray-600'>For privacy questions: privacy@autorentpro.com or call +254743 861 565</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 px-4 py-4 border-t border-gray-200">
          <button onClick={() => router.back()} className="px-6 py-2.5  text-gray-400 border border-gray-200 p-2 text-sm font-medium rounded hover:bg-gray-100 transition-colors">
            Back
          </button>
          
        </div>
        </div>
      </div>
    </div>
  )
}

export default page