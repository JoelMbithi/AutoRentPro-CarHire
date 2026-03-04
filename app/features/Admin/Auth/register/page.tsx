"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Lock, MapPin, Car, Shield, Building2 } from "lucide-react";
import InputField from "../Components/InputField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminRegisterForm, OwnerRegisterForm } from "../Components/types";

type UserType = "admin" | "owner";

const RegisterPage = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Admin form state
  const [adminForm, setAdminForm] = useState<AdminRegisterForm>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  // Owner form state
  const [ownerForm, setOwnerForm] = useState<OwnerRegisterForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    licenseNumber: "",
    carMake: "",
    carModel: "",
    carYear: "",
    carColor: "",
    plateNumber: "",
    password: "",
    confirmPassword: "",
  });

 const handleAdminSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setFieldErrors({});

  try {
    const formData = new FormData();

    // Add all admin form fields to FormData
    Object.keys(adminForm).forEach(key => {
      const value = adminForm[key as keyof AdminRegisterForm];
      if (value) {
        formData.append(key, value.toString());
      }
    });
    
    // Add user type
    formData.append('userType', 'admin');

    const response = await fetch('/features/Admin/Auth/api/register', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setSuccess(data.message);
      setTimeout(() => {
        router.push("/features/Admin/Auth/login");
      }, 2000);
    } else {
      if (data.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data.message || 'Registration failed');
      }
      setLoading(false);
    }
  } catch (error) {
    console.error('Submission error:', error);
    setError('Network error. Please try again.');
    setLoading(false);
  }
};

const handleOwnerSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setFieldErrors({});

  try {
    const formData = new FormData();

    // Add all owner form fields to FormData
    Object.keys(ownerForm).forEach(key => {
      const value = ownerForm[key as keyof OwnerRegisterForm];
      if (value) {
        formData.append(key, value.toString());
      }
    });
    
    // Add user type
    formData.append('userType', 'owner');

    const response = await fetch('/features/Admin/Auth/api/register', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setSuccess(data.message);
      setTimeout(() => {
        router.push("/features/Admin/Auth/login");
      }, 2000);
    } else {
      if (data.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data.message || 'Registration failed');
      }
      setLoading(false);
    }
  } catch (error) {
    console.error('Submission error:', error);
    setError('Network error. Please try again.');
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-400 mt-1">Register as an admin or car owner</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setUserType("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                userType === "admin"
                  ? "text-orange-600 border-orange-500"
                  : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Building2 size={15} />
              Register as Admin
            </button>
            <button
              onClick={() => setUserType("owner")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                userType === "owner"
                  ? "text-orange-600 border-orange-500"
                  : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Car size={15} />
              Register as Car Owner
            </button>
          </div>

          {/* Admin Registration Form */}
          {userType === "admin" && (
            <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={adminForm.fullName}
                  onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                  icon={<User size={16} />}
                />
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="your@company.com"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  icon={<Mail size={16} />}
                />
              </div>

              <InputField
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="+1(254) 743 861 565"
                value={adminForm.phone}
                onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                icon={<Phone size={16} />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Password"
                  name="password"
                  placeholder="Min. 8 characters"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  icon={<Lock size={16} />}
                  showToggle
                  showPassword={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={adminForm.confirmPassword}
                  onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                  icon={<Lock size={16} />}
                  showToggle
                  showPassword={showConfirm}
                  onToggle={() => setShowConfirm(!showConfirm)}
                />
              </div>

              {adminForm.password && adminForm.confirmPassword &&
                adminForm.password !== adminForm.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match.</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Registering...' : 'Register as Admin'}
              </button>
                          </form>
          )}

          {/* Car Owner Registration Form */}
          {userType === "owner" && (
            <form onSubmit={handleOwnerSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={ownerForm.fullName}
                  onChange={(e) => setOwnerForm({ ...ownerForm, fullName: e.target.value })}
                  icon={<User size={16} />}
                />
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Enter your email.com"
                  value={ownerForm.email}
                  onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                  icon={<Mail size={16} />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="+(254) 743 861 565"
                  value={ownerForm.phone}
                  onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })}
                  icon={<Phone size={16} />}
                />
                <InputField
                  label="License Number"
                  name="licenseNumber"
                  placeholder="DL-123456"
                  value={ownerForm.licenseNumber}
                  onChange={(e) => setOwnerForm({ ...ownerForm, licenseNumber: e.target.value })}
                  icon={<Shield size={16} />}
                />
              </div>

              <InputField
                label="Address"
                name="address"
                placeholder="123 Main Street, City, State"
                value={ownerForm.address}
                onChange={(e) => setOwnerForm({ ...ownerForm, address: e.target.value })}
                icon={<MapPin size={16} />}
              />

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  Vehicle Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Car Make"
                    name="carMake"
                    placeholder="Toyota"
                    value={ownerForm.carMake}
                    onChange={(e) => setOwnerForm({ ...ownerForm, carMake: e.target.value })}
                    icon={<Car size={16} />}
                  />
                  <InputField
                    label="Car Model"
                    name="carModel"
                    placeholder="Camry"
                    value={ownerForm.carModel}
                    onChange={(e) => setOwnerForm({ ...ownerForm, carModel: e.target.value })}
                    icon={<Car size={16} />}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <InputField
                    label="Year"
                    type="number"
                    name="carYear"
                    placeholder="2024"
                    value={ownerForm.carYear}
                    onChange={(e) => setOwnerForm({ ...ownerForm, carYear: e.target.value })}
                    icon={<Car size={16} />}
                  />
                  <InputField
                    label="Color"
                    name="carColor"
                    placeholder="White"
                    value={ownerForm.carColor}
                    onChange={(e) => setOwnerForm({ ...ownerForm, carColor: e.target.value })}
                    icon={<Car size={16} />}
                  />
                  <InputField
                    label="Plate"
                    name="plateNumber"
                    placeholder="ABC-123"
                    value={ownerForm.plateNumber}
                    onChange={(e) => setOwnerForm({ ...ownerForm, plateNumber: e.target.value })}
                    icon={<Car size={16} />}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  Security
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Password"
                    name="password"
                    placeholder="Min. 8 characters"
                    value={ownerForm.password}
                    onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                    icon={<Lock size={16} />}
                    showToggle
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={ownerForm.confirmPassword}
                    onChange={(e) => setOwnerForm({ ...ownerForm, confirmPassword: e.target.value })}
                    icon={<Lock size={16} />}
                    showToggle
                    showPassword={showConfirm}
                    onToggle={() => setShowConfirm(!showConfirm)}
                  />
                </div>
              </div>

              {ownerForm.password && ownerForm.confirmPassword &&
                ownerForm.password !== ownerForm.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match.</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
              >
                Register as Car Owner
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="border-t border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/features/Admin/Auth/login" className="text-orange-500 font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;