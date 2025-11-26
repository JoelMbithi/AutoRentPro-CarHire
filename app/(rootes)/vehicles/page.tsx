import AllVehicles from '@/app/features/car-listing/components/AllVehicles'
import FleetBanner from '@/app/features/car-listing/components/FleetBanner'
import React from 'react'

const Page = () => {
  return (
   <div>
    <FleetBanner/>
    <AllVehicles/>
   </div>
  )
}

export default Page