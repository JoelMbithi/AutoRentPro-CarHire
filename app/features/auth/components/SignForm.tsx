"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/features/auth/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Dispatch custom event for navbar to listen to
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('user-login'));
        }
        
        // ROLE-BASED REDIRECT - Check user role from response
        let redirectUrl = "/";
        if (data.user?.role === "ADMIN") {
          redirectUrl = "/features/Admin/Dashboard";
        } else if (data.user?.role === "AGENT") {
          redirectUrl = "/features/Agent/Dashboard";
        } else {
          redirectUrl = "/";
        }
        
        // Use replace with role-based URL
        router.replace(redirectUrl);
        
        // Force a hard refresh after a tiny delay to ensure cookie is set
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        setError(data.error || "Sign in failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || !formData.email || !formData.password;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-gray-200 rounded-lg p-8 shadow">

        {/* Logo */}
        <div className="mb-10">
          <Link href="/">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-xl font-bold tracking-tight">
              <span className="text-gray-900">Auto</span>
              <span className="text-orange-600">Rent</span>
              <span className="text-gray-900">Pro</span>
              <span className="text-orange-600">.</span>
            </span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-gray-900">Sign in</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-orange-600 hover:text-orange-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors mt-2
              ${isButtonDisabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          No account?{" "}
          <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 font-medium">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignForm;