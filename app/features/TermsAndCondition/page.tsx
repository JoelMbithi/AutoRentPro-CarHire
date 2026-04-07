'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)

  return (
    <div className='flex flex-col px-4 py-4 items-center bg-gray-50'>
      <div className='flex flex-col w-full max-w-3xl bg-white rounded-lg border border-gray-100'>
        
        {/* Header */}
        <div className='px-6 py-5 border-b border-gray-200'>
          <h1 className='text-xs text-gray-400 tracking-wider mb-1'>TERMS & CONDITIONS</h1>
          <h2 className='text-xl font-semibold text-gray-800'>Car Rental Terms of Service</h2>
          <p className='text-xs text-gray-500 mt-1'>Effective from: January 2026</p>
        </div>

        {/* Content */}
        <div className='px-6 py-5 space-y-5'>
          
          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>1. Driver Requirements</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              Renters must have a valid driver's license held for a minimum of 2 years. Minimum age is 21 years 
              (young driver surcharge applies for ages 21-24). Maximum age is 75 years. International renters 
              require a valid passport and International Driving Permit if license is not in English.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>2. Insurance & Liability</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              Basic third-party insurance is included. A damage excess of Ksh 10,200 applies. Collision Damage 
              Waiver (CDW) is available to reduce excess to Ksh 5,100. Theft Protection is included. Renters are 
              responsible for all damages not covered by insurance.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>3. Payment & Security Deposit</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              Full payment is required at vehicle collection. A refundable security deposit of Ksh 10,200 is held 
              on your credit card and released within 7-14 days after return, subject to vehicle inspection. Cash 
              deposits are not accepted.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>4. Fuel Policy</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              Vehicles are provided with a full tank and must be returned with a full tank. Refueling charges of 
              Ksh 1,500 + fuel cost apply if returned without refueling. Pre-paid fuel options are available.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>5. Mileage & Usage</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              200 km per day included. Additional km charged at Ksh 25 per km. Vehicles cannot be used for: off-road 
              driving, towing, unauthorized drivers, or cross-border travel without prior approval.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>6. Cancellation Policy</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              Free cancellation up to 48 hours before pickup. 50% charge for cancellations between 24-48 hours. 
              100% charge for cancellations within 24 hours or no-show.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>7. Traffic Violations</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              Renters are fully responsible for all traffic fines, parking tickets, and toll charges. A Ksh 1,000 
              administrative fee applies per violation processed on your behalf.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>8. Late Returns</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              59-minute grace period allowed. Beyond this, an additional day's rental rate applies. Extensions must 
              be requested 24 hours in advance and are subject to availability.
            </p>
          </div>

          <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
            <div
              onClick={() => setAgreed(!agreed)}
              className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                agreed ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
              }`}
            >
              {agreed && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3L3.5 5.5L8 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className='text-xs text-gray-600 leading-relaxed flex-1'>
              I have read and agree to the Terms & Conditions of AutoRentPro.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={() => router.back()}
              disabled={!agreed}
              className={`px-6 py-2.5 text-sm font-semibold rounded transition-colors ${
                agreed 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Agree & Continue
            </button>
            <button className="px-6 py-2.5 text-gray-600 border border-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
              Download Terms
            </button>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default page