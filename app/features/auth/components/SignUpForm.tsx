"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaCar, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    drivingLicense: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading,setLoading] = useState(false)
 const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      setLoading(true)

      const response = await fetch("/features/auth/api/signup",{
        method:"POST",
        headers:{'Content-Type':' application/json'},
        body: JSON.stringify(formData)
      });

      const data = await response.json()

      if(data.success){
        console.log("User Created successfully", data.user)
         router.push("/auth/signin")
      }else{
        console.log("Error creating user:", data.error)
      }
      
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
  };

  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password)
  };

  const passwordScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="text-3xl font-bold text-gray-900 tracking-tight">
              <span className="text-orange-600">Auto</span>
              <span className="text-gray-800">Rent</span>
              <span className="text-orange-600">Pro</span>
              <span className="text-gray-800">.</span>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Account
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Join thousands of satisfied customers and start your car rental journey today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter your first name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Driving License */}
            <div>
              <label htmlFor="drivingLicense" className="block text-sm font-semibold text-gray-700 mb-2">
                Driving License Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="drivingLicense"
                  name="drivingLicense"
                  type="text"
                  required
                  value={formData.drivingLicense}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter your driving license number"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Password strength</span>
                    <span className="text-sm font-semibold text-gray-600">
                      {passwordScore}/4
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordScore === 1 ? 'bg-red-500 w-1/4' :
                        passwordScore === 2 ? 'bg-orange-500 w-1/2' :
                        passwordScore === 3 ? 'bg-yellow-500 w-3/4' :
                        passwordScore === 4 ? 'bg-green-500 w-full' :
                        'bg-gray-200 w-0'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <FaCheck className={`h-3 w-3 ${passwordStrength.length ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={`text-xs ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                        8+ characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className={`h-3 w-3 ${passwordStrength.uppercase ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={`text-xs ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        Uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className={`h-3 w-3 ${passwordStrength.number ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={`text-xs ${passwordStrength.number ? 'text-green-600' : 'text-gray-500'}`}>
                        Number
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className={`h-3 w-3 ${passwordStrength.special ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={`text-xs ${passwordStrength.special ? 'text-green-600' : 'text-gray-500'}`}>
                        Special character
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.agreeToTerms || formData.password !== formData.confirmPassword}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaCar className="text-orange-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Quick Bookings</h3>
            <p className="text-sm text-gray-600">Reserve your vehicle in minutes</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaCheck className="text-orange-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Best Prices</h3>
            <p className="text-sm text-gray-600">Exclusive member discounts</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-orange-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Secure</h3>
            <p className="text-sm text-gray-600">Your data is protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;