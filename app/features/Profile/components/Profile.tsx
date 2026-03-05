"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, FileText, Save, X, Edit, Camera,
  Shield, CheckCircle, Building, Car, CreditCard, Globe, Lock, Bell,
  ShieldCheck, Award, Star, Clock, TrendingUp, ChevronLeft, Settings,
  Smartphone, CreditCard as Card, Eye, EyeOff
} from 'lucide-react';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  drivingLicense: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt?: string;
  profileImage?: string;
  membershipLevel?: string;
  totalBookings?: number;
  loyaltyPoints?: number;
}

interface ProfileProps {
  openProfile: boolean;
  onClose: () => void;
  user: UserData | null;
  onProfileUpdate?: (updatedUser: UserData) => void;
}

const Profile: React.FC<ProfileProps> = ({ openProfile, onClose, user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    drivingLicense: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'license' | 'security' | 'preferences'>('personal');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userPoints, setUserPoints] = useState<number>(0);
  
  // Add state for user bookings count
  const [completedBookings, setCompletedBookings] = useState<number>(0);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        drivingLicense: user.drivingLicense || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || ''
      });
      
      // Fetch completed bookings when user is available
      if (user.id) {
        fetchUserCompletedBookings(user.id);
      }
    }
  }, [user]);

  // Function to fetch completed bookings from database
  const fetchUserCompletedBookings = async (userId: number) => {
    setLoadingBookings(true);
    try {
      const response = await fetch(`/features/Profile/api/bookings/completed?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setCompletedBookings(data.count);
        setUserPoints(data.points);
      } else {
        console.error('Failed to fetch completed bookings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/features/Profile/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Profile updated successfully');
        if (onProfileUpdate && data.user) {
          onProfileUpdate(data.user);
        }
        setTimeout(() => {
          setIsEditing(false);
          setSuccess(null);
        }, 2000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        drivingLicense: user.drivingLicense || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || ''
      });
    }
  };

  if (!user || !openProfile) return null;

  const getUserInitials = () => {
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || "U";
  };

  // User stats with real completed bookings count
  const userStats = [
    { 
      label: 'Completed Bookings', 
      value: loadingBookings ? '...' : completedBookings.toString(), 
      icon: Car 
    },
    { 
      label: 'Points', 
       value: loadingBookings ? '...' : userPoints.toLocaleString(),
      icon: Award 
    },
    { 
      label: 'Since', 
      value: new Date(user.createdAt).getFullYear(), 
      icon: Clock 
    },
    { 
      label: 'Level', 
      value: user.membershipLevel || 'Gold', 
      icon: TrendingUp 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      {/* Header - Responsive */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">Back</span>
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Profile</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-orange-700 text-xs sm:text-sm font-medium"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Edit</span>
                  <span className="xs:hidden">Edit</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center border border-gray-300 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Cancel</span>
                    <span className="xs:hidden">X</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-700 text-xs sm:text-sm font-medium disabled:opacity-50"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {isLoading ? (
                      <span className="hidden xs:inline">Saving...</span>
                    ) : (
                      <>
                        <span className="hidden xs:inline">Save</span>
                        <span className="xs:hidden">Save</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Messages */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs sm:text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs sm:text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile Header - Responsive */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl sm:text-2xl font-bold text-gray-500">{getUserInitials()}</span>
                    )}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
                    <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
                  </button>
                </div>
                
                {/* Basic Info */}
                <div className="flex-1 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-500 mt-1 break-all">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      {user.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded whitespace-nowrap">
                          Verified
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded whitespace-nowrap">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  
                  {/* Stats - Responsive grid with real data */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
                    {userStats.map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div key={i} className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 mx-auto mb-1" />
                          <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            {loadingBookings && stat.label === 'Completed Bookings' ? (
                              <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                            ) : (
                              stat.value
                            )}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500 truncate">{stat.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs - Responsive scrollable */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex gap-4 sm:gap-6 min-w-max px-1">
                {[
                  { id: 'personal', label: 'Personal', icon: User },
                  { id: 'license', label: 'License', icon: FileText },
                  { id: 'security', label: 'Security', icon: Lock },
                  { id: 'preferences', label: 'Preferences', icon: Bell },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 sm:py-3 px-1 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-orange-600 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content - Responsive */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              {/* Personal Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 py-1.5 sm:py-2 break-words">{user.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 py-1.5 sm:py-2 break-words">{user.lastName}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 py-1.5 sm:py-2 break-all">{user.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+254 700 000 000"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 py-1.5 sm:py-2 break-words">{user.phone || '—'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 py-1.5 sm:py-2">
                          {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—'}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 py-1.5 sm:py-2 break-words">{user.address || '—'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 py-1.5 sm:py-2 break-words">{user.city || '—'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 mb-1">Country</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-sm sm:text-base text-gray-900 py-1.5 sm:py-2 break-words">{user.country || '—'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* License Tab */}
              {activeTab === 'license' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">License Information</h3>
                  
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-600 mb-1">License Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="drivingLicense"
                        value={formData.drivingLicense}
                        onChange={handleInputChange}
                        className="w-full max-w-md px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-sm sm:text-base text-gray-900 py-1.5 sm:py-2 break-words">{user.drivingLicense || '—'}</p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-blue-800">Secure & Verified</p>
                        <p className="text-[10px] sm:text-xs text-blue-600 mt-1">
                          Your license information is encrypted and only used for verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Change Password</h3>
                    <div className="space-y-3 max-w-md">
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Current password"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm pr-8 sm:pr-10"
                        />
                        <button
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showCurrentPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New password"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm pr-8 sm:pr-10"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showNewPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm pr-8 sm:pr-10"
                        />
                        <button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </button>
                      </div>
                      <button className="w-full sm:w-auto bg-gray-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-6 border-t border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Two-Factor Authentication</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">Add extra security</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Protect your account with 2FA</p>
                      </div>
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Notifications</h3>
                  
                  {[
                    { label: 'Booking Confirmations', desc: 'Get notified when you book a car' },
                    { label: 'Promotional Offers', desc: 'Receive special deals and discounts' },
                    { label: 'Account Updates', desc: 'Important changes to your account' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0 gap-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer self-start sm:self-auto">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 sm:w-10 h-4 sm:h-5 bg-gray-200 rounded-full peer-checked:bg-orange-600 peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 sm:after:h-4 after:w-3 sm:after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar - Responsive */}
          <div className="space-y-4 sm:space-y-6 mt-4 lg:mt-0">
            {/* Account Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Account Status</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Verification</span>
                  <span className={`text-xs sm:text-sm font-medium ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Member since</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Last updated</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Today'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Level</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{user.membershipLevel || 'Gold'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Payment Methods</span>
                  </div>
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <Car className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Booking History</span>
                  </div>
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Download App</span>
                  </div>
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 rotate-180" />
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Need help?</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                Contact our support team for assistance.
              </p>
              <button className="w-full bg-white text-gray-900 px-3 sm:px-4 py-2 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;