"use client";

import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, FileText, Save, X, Edit, Camera,
  ChevronLeft, Lock, Bell, Eye, EyeOff, Car, CreditCard, Smartphone
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
    firstName: '', lastName: '', email: '', phone: '',
    drivingLicense: '', dateOfBirth: '', address: '', city: '', country: '',
  });
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [activeTab, setActiveTab]   = useState<'personal' | 'license' | 'security' | 'preferences'>('personal');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [completedBookings, setCompletedBookings]     = useState<number>(0);
  const [userPoints, setUserPoints]                   = useState<number>(0);
  const [loadingBookings, setLoadingBookings]         = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName:      user.firstName      || '',
        lastName:       user.lastName       || '',
        email:          user.email          || '',
        phone:          user.phone          || '',
        drivingLicense: user.drivingLicense || '',
        dateOfBirth:    user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address:        user.address        || '',
        city:           user.city           || '',
        country:        user.country        || '',
      });
      if (user.id) fetchUserCompletedBookings(user.id);
    }
  }, [user]);

  const fetchUserCompletedBookings = async (userId: number) => {
    setLoadingBookings(true);
    try {
      const res  = await fetch(`/features/Profile/api/bookings/completed?userId=${userId}`);
      const data = await res.json();
      if (data.success) { setCompletedBookings(data.count); setUserPoints(data.points); }
    } catch { /* silent */ } finally { setLoadingBookings(false); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) { setError('First name is required'); return false; }
    if (!formData.lastName.trim())  { setError('Last name is required');  return false; }
    if (!formData.email.trim())     { setError('Email is required');      return false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { setError('Please enter a valid email address'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true); setError(null); setSuccess(null);
    try {
      const res  = await fetch('/features/Profile/api/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Profile updated successfully');
        if (onProfileUpdate && data.user) onProfileUpdate(data.user);
        setTimeout(() => { setIsEditing(false); setSuccess(null); }, 2000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch { setError('An error occurred while updating profile'); }
    finally { setIsLoading(false); }
  };

  const handleCancel = () => {
    setIsEditing(false); setError(null); setSuccess(null);
    if (user) setFormData({
      firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '',
      phone: user.phone || '', drivingLicense: user.drivingLicense || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      address: user.address || '', city: user.city || '', country: user.country || '',
    });
  };

  if (!user || !openProfile) return null;

  const getUserInitials = () =>
    `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-orange-400 transition';
  const labelClass = 'block text-sm text-gray-500 mb-1';

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-base font-semibold text-gray-900">Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-1.5 bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-700 transition-colors">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button onClick={handleSave} disabled={isLoading} className="inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" /> {isLoading ? 'Saving…' : 'Save'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {error   && <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}
        {success && <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">{success}</div>}

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">

          {/* Left — main */}
          <div className="lg:col-span-2 space-y-5">

            {/* Profile header */}
            <div className="bg-white border border-gray-200 rounded p-5">
              <div className="flex items-start gap-5">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    {user.profileImage
                      ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                      : <span className="text-lg font-semibold text-gray-500">{getUserInitials()}</span>
                    }
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">
                    <Camera className="w-3 h-3 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {user.isVerified && (
                        <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded">Verified</span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{user.role}</span>
                    </div>
                  </div>

                  {/* Stats — plain text row, no icon boxes */}
                  <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{loadingBookings ? '…' : completedBookings}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Bookings</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{loadingBookings ? '…' : userPoints.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Points</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{new Date(user.createdAt).getFullYear()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Member since</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.membershipLevel || 'Gold'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Level</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex gap-5 min-w-max">
                {([
                  { id: 'personal',     label: 'Personal' },
                  { id: 'license',      label: 'License' },
                  { id: 'security',     label: 'Security' },
                  { id: 'preferences',  label: 'Preferences' },
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="bg-white border border-gray-200 rounded p-5">

              {/* Personal */}
              {activeTab === 'personal' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-5">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'firstName', label: 'First name', type: 'text',  value: user.firstName, span: false },
                      { name: 'lastName',  label: 'Last name',  type: 'text',  value: user.lastName,  span: false },
                      { name: 'email',     label: 'Email',      type: 'email', value: user.email,     span: true  },
                      { name: 'phone',     label: 'Phone',      type: 'tel',   value: user.phone,     span: false },
                      { name: 'dateOfBirth', label: 'Date of birth', type: 'date',
                        value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—', span: false },
                      { name: 'address',   label: 'Address',    type: 'text',  value: user.address,   span: true  },
                      { name: 'city',      label: 'City',       type: 'text',  value: user.city,      span: false },
                      { name: 'country',   label: 'Country',    type: 'text',  value: user.country,   span: false },
                    ].map((field) => (
                      <div key={field.name} className={field.span ? 'sm:col-span-2' : ''}>
                        <label className={labelClass}>{field.label}</label>
                        {isEditing ? (
                          <input
                            type={field.type}
                            name={field.name}
                            value={(formData as any)[field.name]}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 py-1.5">{field.value || '—'}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* License */}
              {activeTab === 'license' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-5">License Information</h3>
                  <div className="mb-5">
                    <label className={labelClass}>License number</label>
                    {isEditing ? (
                      <input type="text" name="drivingLicense" value={formData.drivingLicense} onChange={handleInputChange} className={`${inputClass} max-w-sm`} />
                    ) : (
                      <p className="text-sm text-gray-900 py-1.5">{user.drivingLicense || '—'}</p>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded p-3">
                    <p className="text-sm font-medium text-blue-800 mb-0.5">Secure & Verified</p>
                    <p className="text-xs text-blue-600">Your license information is encrypted and only used for verification.</p>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="space-y-7">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-3 max-w-sm">
                      {[
                        { show: showCurrentPassword, toggle: () => setShowCurrentPassword(v => !v), placeholder: 'Current password' },
                        { show: showNewPassword,     toggle: () => setShowNewPassword(v => !v),     placeholder: 'New password' },
                        { show: showConfirmPassword, toggle: () => setShowConfirmPassword(v => !v), placeholder: 'Confirm password' },
                      ].map((field, i) => (
                        <div key={i} className="relative">
                          <input type={field.show ? 'text' : 'password'} placeholder={field.placeholder} className={`${inputClass} pr-9`} />
                          <button onClick={field.toggle} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      ))}
                      <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded text-sm font-medium transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-900">Add extra security</p>
                        <p className="text-xs text-gray-500 mt-0.5">Protect your account with 2FA</p>
                      </div>
                      <button className="border border-gray-200 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors">Enable</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-5">Notifications</h3>
                  <div className="space-y-1">
                    {[
                      { label: 'Booking Confirmations', desc: 'Get notified when you book a car' },
                      { label: 'Promotional Offers',    desc: 'Receive special deals and discounts' },
                      { label: 'Account Updates',       desc: 'Important changes to your account' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-orange-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — sidebar */}
          <div className="space-y-4">

            {/* Account status */}
            <div className="bg-white border border-gray-200 rounded p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification</span>
                  <span className={`font-medium ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member since</span>
                  <span className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last updated</span>
                  <span className="text-gray-900 font-medium">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Today'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Level</span>
                  <span className="text-gray-900 font-medium">{user.membershipLevel || 'Gold'}</span>
                </div>
              </div>
            </div>

            {/* Quick actions — plain list, no icon boxes */}
            <div className="bg-white border border-gray-200 rounded p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-1">
                {[
                  { label: 'Payment Methods', icon: CreditCard },
                  { label: 'Booking History', icon: Car },
                  { label: 'Download App',    icon: Smartphone },
                ].map(({ label, icon: Icon }) => (
                  <button key={label} className="w-full flex items-center justify-between py-2.5 text-sm text-gray-700 hover:text-gray-900 border-b border-gray-50 last:border-0 transition-colors">
                    <span>{label}</span>
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-300 rotate-180" />
                  </button>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-900 rounded p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Need help?</h3>
              <p className="text-xs text-gray-400 mb-4">Contact our support team for assistance.</p>
              <button className="w-full bg-white text-gray-900 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
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