"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaCar, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const SignForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch("/features/auth/api/signin", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log("User signed In successfully", data.user);
        // Force a full page reload to update the navbar
        window.location.href = "/";
      } else {
        setError(data.error || "Sign in failed");
        console.log("Error signing in:", data.error);
      }
      
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove password strength for sign-in (it's more relevant for sign-up)
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
            Sign In To Your Account
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Welcome back! Sign in to continue your car rental journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.password || !formData.email}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Sign up here
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

export default SignForm;