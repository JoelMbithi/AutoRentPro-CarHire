'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const router = useRouter()
  return (
    <div className='flex flex-col px-4 py-4 items-center'>
      <div className='flex flex-col px-10 border h-auto pb-8 w-full max-w-3xl bg-white/20 border-gray-100 rounded-lg'>
        {/* Top Display */}
        <div className="flex flex-col px-4 py-6 items-start border-b border-gray-200">
          <h1 className='text-xs text-gray-400 tracking-wider mb-1'>AGREEMENT</h1>
          <h1 className='text-2xl font-bold text-gray-800'>Terms of Service</h1>
        </div>

        {/* Terms */}
        <div className="flex flex-col px-4 py-6 text-gray-600 space-y-3">
          <p className="text-sm leading-relaxed">
            These are the terms and conditions for using AutoRentPro services. 
            Please read these terms carefully before hiring a vehicle.
          </p>
          
          <div className="bg-orange-50/50 p-4 rounded-lg space-y-2">
            <h2 className="font-semibold text-gray-700 text-sm">Driver Requirements</h2>
            <p className="text-xs">• Valid driver's license held for minimum 2 years</p>
            <p className="text-xs">• Age 21+ (young driver fee applies 21-24)</p>
            <p className="text-xs">• Credit card required for security deposit</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700 text-sm">Insurance & Protection</h2>
            <p className="text-xs">Basic insurance included in rental price. Additional coverage available at pickup.</p>
            <p className="text-xs">Damage excess: Ksh 10,200 (reducible with premium insurance)</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700 text-sm">Fuel Policy</h2>
            <p className="text-xs">Vehicle provided with full tank. Please return with full tank or refueling charges apply.</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700 text-sm">Mileage</h2>
            <p className="text-xs">150 miles per day included. Additional miles: Ksh 0.25/mile</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700 text-sm">Cancellation</h2>
            <p className="text-xs">Free cancellation up to 24 hours before pickup. Late cancellation: 50% charge.</p>
          </div>

          <p className="text-xs text-gray-500 italic mt-4">
            By using our services, you agree to be bound by these terms and conditions. 
            If you do not agree to these terms and conditions, please do not use our services.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 px-4 py-4 border-t border-gray-200">
          <button onClick={() => router.back()} className="px-6 py-2.5 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-500 transition-colors">
            I Agree - Continue
          </button>
          <button className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
            Download Terms
          </button>
        </div>

        
      </div>
    </div>
  )
}

export default page