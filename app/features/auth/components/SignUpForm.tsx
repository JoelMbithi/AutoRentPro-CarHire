"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      setLoading(true);

      const response = await fetch("/features/auth/api/signup", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        router.push("/auth/signin");
      } else {
        console.log("Error creating user:", data.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    setIsSubmitting(false);
  };

  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password)
  };

  const passwordScore = Object.values(passwordStrength).filter(Boolean).length;

  const isDisabled = isSubmitting || !formData.agreeToTerms || formData.password !== formData.confirmPassword;

  const inputClass = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-white flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg border border-gray-200 rounded-lg p-8">

        {/* Logo */}
        <div className="mb-10">
          <Link href="/">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gray-900">Auto</span>
              <span className="text-orange-600">Rent</span>
              <span className="text-gray-900">Pro</span>
              <span className="text-orange-600">.</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-gray-900">Create an account</h1>
          <p className="mt-1 text-sm text-gray-500">Fill in your details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelClass}>First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your last name"
              />
            </div>
          </div>

           <div className="grid grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter your Email"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>Phone number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+254 700 000 000"
            />
          </div>

      </div>
     
          {/* Driving License */}
          <div>
            <label htmlFor="drivingLicense" className={labelClass}>Driving license number</label>
            <input
              id="drivingLicense"
              name="drivingLicense"
              type="text"
              required
              value={formData.drivingLicense}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter license number"
            />
          </div>
 <div className="grid grid-cols-2 gap-4">
          {/* Password */}
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className={`${inputClass} pr-10`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>

            {/* Password strength */}
            {formData.password && (
              <div className="mt-2.5">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= passwordScore
                          ? passwordScore <= 1 ? 'bg-red-400'
                          : passwordScore === 2 ? 'bg-orange-400'
                          : passwordScore === 3 ? 'bg-yellow-400'
                          : 'bg-green-500'
                          : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {[
                    { key: 'length', label: '8+ chars' },
                    { key: 'uppercase', label: 'Uppercase' },
                    { key: 'number', label: 'Number' },
                    { key: 'special', label: 'Special char' },
                  ].map(({ key, label }) => (
                    <span
                      key={key}
                      className={`text-xs ${passwordStrength[key as keyof typeof passwordStrength] ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {passwordStrength[key as keyof typeof passwordStrength] ? '✓' : '○'} {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${inputClass} pr-10`}
                placeholder="Repeat your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
</div>
          {/* Terms */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-500">
              I agree to the{' '}
              <Link href="/terms" className="text-orange-600 hover:text-orange-700">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-orange-600 hover:text-orange-700">Privacy Policy</Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors mt-2
              ${isDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default SignUpForm;