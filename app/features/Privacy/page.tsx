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
          <h1 className='text-xs text-gray-400 tracking-wider mb-1'>PRIVACY POLICY</h1>
          <h2 className='text-xl font-semibold text-gray-800'>AutoRentPro Privacy Policy</h2>
          <p className='text-xs text-gray-500 mt-1'>Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className='px-6 py-5 space-y-5'>
          
          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Information We Collect</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              When you rent a vehicle with AutoRentPro, we collect: full name, date of birth, residential address, 
              email address, phone number, driver's license number and issuing authority, passport or national ID 
              (for international renters), payment card details, rental history, and vehicle usage data. At vehicle 
              collection, we may also capture your signature and photograph for verification purposes.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>How We Use Your Information</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              Your information is used to: process and confirm rental reservations, verify your driving eligibility, 
              process security deposits and payments, communicate booking confirmations and updates, comply with 
              insurance and legal requirements, conduct fraud prevention checks, manage traffic violations and toll 
              charges, and improve our customer service experience.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Data Sharing & Disclosure</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              We share your information only when necessary: with insurance providers for coverage, with law enforcement 
              when required by law, with toll authorities for unpaid charges, and with payment processors for transactions. 
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Data Security & Retention</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              We implement industry-standard encryption and security protocols to protect your data. Rental records, 
              including driver's license scans and signed agreements, are retained for 3 years as required by Kenyan 
              law and insurance regulations. Payment information is securely processed through PCI-compliant systems.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Your Rights</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              You have the right to: access your personal data, request corrections to inaccurate information, 
              request deletion of your data (subject to legal retention requirements), withdraw consent for communications, 
              and receive a copy of your data. Contact our Data Protection Officer to exercise these rights.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>Contact Us</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              For privacy-related questions or concerns:<br />
              Email: privacy@autorentpro.com<br />
              Phone: +254 743 861 565<br />
              Address: Mombasa Road, Nairobi, Kenya<br />
              Response time: Within 14 business days
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => router.back()} className="px-6 py-2.5 text-gray-600 border border-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
              Back to Booking
            </button>
            <button onClick={() => window.print()} className="px-6 py-2.5 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors">
              Download Privacy Policy
            </button>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default page