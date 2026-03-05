import AllVehicles from '@/app/features/car-listing/components/AllVehicles'
import FleetBanner from '@/app/features/car-listing/components/FleetBanner'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <div>
      <FleetBanner/>
      <Suspense fallback={
        <div style={{ 
          minHeight: "50vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center"
        }}>
          <div className="w-6 h-6 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
        </div>
      }>
        <AllVehicles />
      </Suspense>
    </div>
  )
}

export default Page