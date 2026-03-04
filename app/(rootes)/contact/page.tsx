import CarHireContact from '@/app/features/ContactUs/components/CarHireContact'
import React, { Suspense } from 'react'

const ContactPage = () => {
  return (
    <div>
      <Suspense fallback={
        <div style={{ 
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          backgroundColor: "#f9fafb"
        }}>
          <div className="w-6 h-6 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
        </div>
      }>
        <CarHireContact />
      </Suspense>
    </div>
  )
}

export default ContactPage