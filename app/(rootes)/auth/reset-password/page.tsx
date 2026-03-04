"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft, FaPaste } from "react-icons/fa";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [resetMethod, setResetMethod] = useState<"token" | "code">(token ? "token" : "code");
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!token && resetMethod === "token") {
      setResetMethod("code");
    }
  }, [token, resetMethod]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting a whole code
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...resetCode];
      pastedCode.forEach((char, i) => {
        if (i < 6 && /^\d*$/.test(char)) {
          newCode[i] = char;
        }
      });
      setResetCode(newCode);
      
      // Auto-focus last filled input or next empty
      const lastFilledIndex = Math.min(pastedCode.length - 1, 5);
      if (lastFilledIndex >= 0 && lastFilledIndex < 5) {
        const nextInput = document.getElementById(`code-${lastFilledIndex + 1}`);
        nextInput?.focus();
      }
    } else {
      // Single character input
      if (value === "" || /^\d*$/.test(value)) {
        const newCode = [...resetCode];
        newCode[index] = value;
        setResetCode(newCode);
        
        // Auto-focus next input
        if (value !== "" && index < 5) {
          const nextInput = document.getElementById(`code-${index + 1}`);
          nextInput?.focus();
        }
      }
    }
    if (error) setError("");
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !resetCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/\D/g, '').slice(0, 6);
      if (cleaned.length === 6) {
        const newCode = cleaned.split('');
        setResetCode(newCode);
        setError("");
      } else {
        setError("Please copy a valid 6-digit code");
      }
    } catch (err) {
      setError("Unable to paste. Please type the code manually.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    // Validate code if using code method
    if (resetMethod === "code") {
      const codeString = resetCode.join('');
      if (codeString.length !== 6) {
        setError("Please enter the complete 6-digit code");
        return;
      }
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/features/auth/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetMethod === "token" ? token : undefined,
          code: resetMethod === "code" ? resetCode.join('') : undefined,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMethodSwitch = () => {
    setResetMethod(resetMethod === "token" ? "code" : "token");
    setError("");
  };

  if (!isValidToken && resetMethod === "token" && !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full">
          {/* Back to Sign In */}
          <div className="mb-4">
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors"
            >
              <FaArrowLeft className="mr-2 text-xs" />
              Back to Sign In
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
            <p className="text-gray-500 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/auth/forgot-password"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Request New Link
            </Link>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                Have a reset code instead?
              </p>
              <button
                onClick={() => {
                  setResetMethod("code");
                  setIsValidToken(true);
                }}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Enter reset code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        
        {/* Back to Sign In */}
        <div className="mb-4">
          <Link 
            href="/auth/signin" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors"
          >
            <FaArrowLeft className="mr-2 text-xs" />
            Back to Sign In
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-5">
            <span className="text-2xl font-black tracking-tight">
              <span className="text-gray-900">Auto</span>
              <span className="text-red-500">Rent</span>
              <span className="text-gray-900">Pro</span>
              <span className="text-red-500">.</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            Reset Password
          </h1>
          <p className="text-gray-500 text-sm">
            {!success 
              ? resetMethod === "token" 
                ? "Enter your new password below" 
                : "Enter the 6-digit code and your new password"
              : "Password reset successful!"
            }
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been successfully reset.
              </p>
              <p className="text-xs text-gray-400">
                Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Reset Code Input (only show if using code method) */}
              {resetMethod === "code" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-3">
                    6-Digit Reset Code
                  </label>
                  <div className="flex justify-between gap-2">
                    {resetCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    ))}
                  </div>
                  
                  {/* Paste button */}
                  <div className="flex justify-center mt-3">
                    <button
                      type="button"
                      onClick={handlePasteCode}
                      className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors"
                    >
                      
                      Paste code
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Enter the 6-digit code from your email
                  </p>
                </div>
              )}

              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 text-sm" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 text-sm" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Password requirements */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password requirements:</p>
                <ul className="space-y-1">
                  <li className="text-xs text-gray-500 flex items-center">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    At least 8 characters long
                  </li>
                  <li className="text-xs text-gray-500 flex items-center">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${formData.password && formData.confirmPassword && formData.password === formData.confirmPassword ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Passwords match
                  </li>
                </ul>
              </div>

              {/* Method switch link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleMethodSwitch}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  {resetMethod === "token" 
                    ? "Have a reset code instead? Use code" 
                    : "Have a reset link instead? Use link"}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.password || !formData.confirmPassword || (resetMethod === "code" && resetCode.join('').length !== 6)}
                className={`
                  w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isSubmitting || !formData.password || !formData.confirmPassword || (resetMethod === "code" && resetCode.join('').length !== 6)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm shadow-orange-200 active:scale-[0.98]'
                  }
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;