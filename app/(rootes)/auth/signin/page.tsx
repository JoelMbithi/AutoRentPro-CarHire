import SignForm from '@/app/features/auth/components/SignForm'
import React from 'react'

export const metadata = {
  title: 'Sign In | AutoRentPro',
  description: 'Sign in to your AutoRentPro account',
}

const SignInPage = () => {
  return (
    <div>
      <SignForm/>
    </div>
  )
}

export default SignInPage