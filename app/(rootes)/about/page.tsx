import AboutBanner from '@/app/features/about/components/AboutBanner'
import AboutDeals from '@/app/features/about/components/AboutDeals'
import AboutServices from '@/app/features/about/components/AboutServices'
import React from 'react'

const page = () => {
  return (
    <div>
      <AboutBanner/>
      <AboutDeals/>
      <AboutServices/>
    </div>
  )
}

export default page
