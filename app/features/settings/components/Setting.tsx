"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, Save, Lock, Mail, User, Phone, Shield, Bell, Globe, 
  CreditCard, Car, ChevronLeft, Moon, Sun, Key, Eye, EyeOff,
  Smartphone, Database, Clock, ShieldCheck, Wifi, WifiOff,
  CreditCard as CardIcon, CheckCircle, AlertCircle, Users,
  Building, MapPin, Wallet, Shield as ShieldIcon, Download,
  Settings as SettingsIcon
} from 'lucide-react';

interface SettingProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const Setting = ({ isOpen, onClose, user }: SettingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('account');
  
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingConfirmations: true,
    bookingReminders: true,
    paymentReceipts: true,
    promotionalOffers: false,
    priceDropAlerts: true,
    systemUpdates: true,
    securityAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // public, contacts, private
    showBookingHistory: false,
    allowContactByOtherUsers: true,
    shareAnalytics: false,
    showOnlineStatus: true,
    allowProfileSearch: true,
    dataRetentionPeriod: '90', // days
    autoDeleteInactiveData: true,
  });

  const [preferences, setPreferences] = useState({
    preferredVehicleType: 'SUV',
    defaultPickupLocation: '',
    defaultPaymentMethod: 'card',
    language: 'en',
    currency: 'KES',
    theme: 'light',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    measurementSystem: 'metric',
    autoConfirmBookings: false,
    defaultRentalDuration: '7',
    favoriteLocations: [] as string[],
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    twoFactorMethod: 'sms', // sms, email, authenticator
    loginAlerts: true,
    autoLogout: true,
    sessionTimeout: 30,
    requirePasswordChange: false,
    passwordChangeDays: 90,
    lastPasswordChange: '',
    trustedDevices: [] as string[],
    loginHistory: [] as any[],
  });

  const [billing, setBilling] = useState({
    defaultPaymentMethod: 'card',
    savePaymentMethods: true,
    autoRenewMembership: true,
    invoiceDelivery: 'email',
    taxReceipts: true,
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Kenya',
    },
    vatNumber: '',
    companyName: '',
  });

  // Password change state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch settings
  useEffect(() => {
    if (isOpen && user) {
      fetchSettings();
    }
  }, [isOpen, user]);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/features/settings/api/settings', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAccountData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
        });

        if (data.settings.notifications) setNotifications(data.settings.notifications);
        if (data.settings.privacy) setPrivacy(data.settings.privacy);
        if (data.settings.preferences) setPreferences(data.settings.preferences);
        if (data.settings.security) setSecurity(data.settings.security);
        if (data.settings.billing) setBilling(data.settings.billing);
      } else {
        setError(data.error || 'Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('An error occurred while fetching settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const requestBody = {
        tab: activeTab,
        accountData: activeTab === 'account' ? accountData : undefined,
        notifications: activeTab === 'notifications' ? notifications : undefined,
        privacy: activeTab === 'privacy' ? privacy : undefined,
        preferences: activeTab === 'preferences' ? preferences : undefined,
        security: activeTab === 'security' ? security : undefined,
        billing: activeTab === 'billing' ? billing : undefined,
      };

      const response = await fetch('/features/settings/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('An error occurred while saving settings');
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setSaveLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/features/settings/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwords),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Password updated successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError('An error occurred while updating password');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default?')) return;

    const defaultSettings = {
      notifications: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        bookingConfirmations: true,
        bookingReminders: true,
        paymentReceipts: true,
        promotionalOffers: false,
        priceDropAlerts: true,
        systemUpdates: true,
        securityAlerts: true,
      },
      privacy: {
        profileVisibility: 'public',
        showBookingHistory: false,
        allowContactByOtherUsers: true,
        shareAnalytics: false,
        showOnlineStatus: true,
        allowProfileSearch: true,
        dataRetentionPeriod: '90',
        autoDeleteInactiveData: true,
      },
      preferences: {
        preferredVehicleType: 'SUV',
        defaultPickupLocation: '',
        defaultPaymentMethod: 'card',
        language: 'en',
        currency: 'KES',
        theme: 'light',
        timezone: 'Africa/Nairobi',
        dateFormat: 'DD/MM/YYYY',
        measurementSystem: 'metric',
        autoConfirmBookings: false,
        defaultRentalDuration: '7',
        favoriteLocations: [],
      },
      security: {
        twoFactorAuth: false,
        twoFactorMethod: 'sms',
        loginAlerts: true,
        autoLogout: true,
        sessionTimeout: 30,
        requirePasswordChange: false,
        passwordChangeDays: 90,
        lastPasswordChange: '',
        trustedDevices: [],
        loginHistory: [],
      },
      billing: {
        defaultPaymentMethod: 'card',
        savePaymentMethods: true,
        autoRenewMembership: true,
        invoiceDelivery: 'email',
        taxReceipts: true,
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Kenya',
        },
        vatNumber: '',
        companyName: '',
      }
    };

    setNotifications(defaultSettings.notifications);
    setPrivacy(defaultSettings.privacy);
    setPreferences(defaultSettings.preferences);
    setSecurity(defaultSettings.security);
    setBilling(defaultSettings.billing);

    setSuccess('Settings reset to defaults');
    setTimeout(() => setSuccess(null), 3000);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} />, description: 'Manage your personal information' },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, description: 'Control how we contact you' },
    { id: 'privacy', label: 'Privacy', icon: <ShieldIcon size={18} />, description: 'Manage your privacy settings' },
    { id: 'preferences', label: 'Preferences', icon: <Car size={18} />, description: 'Customize your experience' },
    { id: 'security', label: 'Security', icon: <Lock size={18} />, description: 'Secure your account' },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} />, description: 'Payment and invoices' },
  ];

  if (!isOpen) return null;

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                disabled={saveLoading || isLoading}
                className="hidden md:inline-flex items-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Reset to Defaults
              </button>
              <button
                onClick={handleSave}
                disabled={saveLoading || isLoading}
                className="inline-flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600 text-sm">Customize your experience</p>
              </div>

              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-start gap-3 w-full px-4 py-3 rounded-lg transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      activeTab === tab.id ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.icon}
                    </div>
                    <div>
                      <span className="font-medium">{tab.label}</span>
                      <p className="text-xs text-gray-500 mt-1">{tab.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* User Info */}
              <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {success}
                </div>
              </div>
            )}

            {/* Tab Content */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
  {/* Account Tab */}
  {activeTab === 'account' && (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <User className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
          <p className="text-gray-600">Update your personal details</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={accountData.firstName}
            onChange={(e) => setAccountData({...accountData, firstName: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={accountData.lastName}
            onChange={(e) => setAccountData({...accountData, lastName: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={accountData.email}
              onChange={(e) => setAccountData({...accountData, email: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pl-11"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={accountData.phone}
              onChange={(e) => setAccountData({...accountData, phone: e.target.value})}
              placeholder="+254 700 000 000"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pl-11"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Deactivate Account</p>
                <p className="text-sm text-gray-500">Temporarily disable your account</p>
              </div>
            </div>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-500">Download your personal data</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Notifications Tab */}
  {activeTab === 'notifications' && (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            <p className="text-gray-600">Choose how you want to be notified</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Receive notifications about {key.toLowerCase().replace('notifications', '')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Notification Channels</h3>
            <p className="text-gray-600 text-sm">Configure how notifications are delivered</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Email</span>
            </div>
            <p className="text-sm text-gray-500">Notifications sent to your email</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Push</span>
            </div>
            <p className="text-sm text-gray-500">In-app and browser notifications</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="font-medium">SMS</span>
            </div>
            <p className="text-sm text-gray-500">Text message notifications</p>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Privacy Tab */}
  {activeTab === 'privacy' && (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
          <p className="text-gray-600">Control your privacy and data</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Profile Visibility</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { value: 'public', label: 'Public', desc: 'Everyone can see your profile' },
              { value: 'contacts', label: 'Contacts Only', desc: 'Only your contacts can see' },
              { value: 'private', label: 'Private', desc: 'Only you can see your profile' },
            ].map((option) => (
              <label key={option.value} className="relative">
                <input
                  type="radio"
                  name="profileVisibility"
                  value={option.value}
                  checked={privacy.profileVisibility === option.value}
                  onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                  className="sr-only peer"
                />
                <div className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-colors">
                  <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">Data Settings</h3>
          <div className="space-y-4">
            {Object.entries(privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-gray-500">Manage your {key.toLowerCase()} settings</p>
                </div>
                {typeof value === 'boolean' ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPrivacy({...privacy, [key]: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                ) : (
                  <select
                    value={value as string}
                    onChange={(e) => setPrivacy({...privacy, [key]: e.target.value})}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {key === 'dataRetentionPeriod' && (
                      <>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                      </>
                    )}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Data Privacy</p>
              <p className="text-sm text-gray-500">
                Your data is protected by our privacy policy. You can request data deletion at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Preferences Tab */}
  {activeTab === 'preferences' && (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Car className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
          <p className="text-gray-600">Customize your rental experience</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Vehicle Type
          </label>
          <select
            value={preferences.preferredVehicleType}
            onChange={(e) => setPreferences({...preferences, preferredVehicleType: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Convertible">Convertible</option>
            <option value="Luxury">Luxury</option>
            <option value="Economy">Economy</option>
            <option value="Minivan">Minivan</option>
            <option value="Truck">Truck</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Rental Duration (days)
          </label>
          <select
            value={preferences.defaultRentalDuration}
            onChange={(e) => setPreferences({...preferences, defaultRentalDuration: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="1">1 day</option>
            <option value="3">3 days</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
            <option value="fr">French</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={preferences.currency}
            onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="KES">Kenyan Shilling (KES)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setPreferences({...preferences, theme: 'light'})}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${
                preferences.theme === 'light' 
                  ? 'border-orange-500 bg-orange-50 text-orange-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              onClick={() => setPreferences({...preferences, theme: 'dark'})}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${
                preferences.theme === 'dark' 
                  ? 'border-gray-800 bg-gray-900 text-white' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Measurement System
          </label>
          <select
            value={preferences.measurementSystem}
            onChange={(e) => setPreferences({...preferences, measurementSystem: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="metric">Metric (km, °C)</option>
            <option value="imperial">Imperial (miles, °F)</option>
          </select>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Auto-Confirm Bookings</p>
            <p className="text-sm text-gray-500">Automatically confirm bookings without review</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.autoConfirmBookings}
              onChange={(e) => setPreferences({...preferences, autoConfirmBookings: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>
    </div>
  )}

  {/* Security Tab */}
  {activeTab === 'security' && (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            <p className="text-gray-600">Protect your account and data</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Password Change */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={saveLoading}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Security Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h3>
            <div className="space-y-4">
              {Object.entries(security).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {key === 'sessionTimeout' 
                        ? 'Minutes before automatic logout' 
                        : `Enable ${key.toLowerCase()} for added security`}
                    </p>
                    {key === 'sessionTimeout' && (
                      <div className="mt-3">
                        <input
                          type="range"
                          min="5"
                          max="120"
                          step="5"
                          value={value as number}
                          onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>5 min</span>
                          <span className="font-medium">{value} min</span>
                          <span>120 min</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {typeof value === 'boolean' && (
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setSecurity({...security, [key]: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Setup */}
      {security.twoFactorAuth && (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-gray-600 text-sm">Choose your verification method</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <label className="relative">
              <input
                type="radio"
                name="twoFactorMethod"
                value="sms"
                checked={security.twoFactorMethod === 'sms'}
                onChange={(e) => setSecurity({...security, twoFactorMethod: e.target.value})}
                className="sr-only peer"
              />
              <div className="p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-colors">
                <div className="font-medium text-gray-900 mb-1">SMS</div>
                <div className="text-sm text-gray-500">Text message verification</div>
              </div>
            </label>
            <label className="relative">
              <input
                type="radio"
                name="twoFactorMethod"
                value="email"
                checked={security.twoFactorMethod === 'email'}
                onChange={(e) => setSecurity({...security, twoFactorMethod: e.target.value})}
                className="sr-only peer"
              />
              <div className="p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-colors">
                <div className="font-medium text-gray-900 mb-1">Email</div>
                <div className="text-sm text-gray-500">Email verification</div>
              </div>
            </label>
            <label className="relative">
              <input
                type="radio"
                name="twoFactorMethod"
                value="authenticator"
                checked={security.twoFactorMethod === 'authenticator'}
                onChange={(e) => setSecurity({...security, twoFactorMethod: e.target.value})}
                className="sr-only peer"
              />
              <div className="p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-colors">
                <div className="font-medium text-gray-900 mb-1">Authenticator App</div>
                <div className="text-sm text-gray-500">Google Authenticator</div>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  )}

  {/* Billing Tab */}
  {activeTab === 'billing' && (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Billing & Payment</h2>
          <p className="text-gray-600">Manage your payment methods and invoices</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Payment Method
          </label>
          <select
            value={billing.defaultPaymentMethod}
            onChange={(e) => setBilling({...billing, defaultPaymentMethod: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="mpesa">M-Pesa</option>
            <option value="paypal">PayPal</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Delivery
          </label>
          <select
            value={billing.invoiceDelivery}
            onChange={(e) => setBilling({...billing, invoiceDelivery: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="email">Email Only</option>
            <option value="email_sms">Email & SMS</option>
            <option value="postal">Postal Mail</option>
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Save Payment Methods</p>
            <p className="text-sm text-gray-500">Securely save your payment details for faster checkout</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={billing.savePaymentMethods}
              onChange={(e) => setBilling({...billing, savePaymentMethods: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Auto-Renew Membership</p>
            <p className="text-sm text-gray-500">Automatically renew your membership when it expires</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={billing.autoRenewMembership}
              onChange={(e) => setBilling({...billing, autoRenewMembership: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Tax Receipts</p>
            <p className="text-sm text-gray-500">Receive tax receipts for business expenses</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={billing.taxReceipts}
              onChange={(e) => setBilling({...billing, taxReceipts: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Default</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">M-Pesa</p>
                <p className="text-sm text-gray-500">+254 712 345 678</p>
              </div>
            </div>
            <button className="text-orange-600 text-sm font-medium hover:text-orange-700">Set as Default</button>
          </div>
          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors font-medium">
            + Add New Payment Method
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          <button className="text-orange-600 text-sm font-medium hover:text-orange-700">View All</button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
               
                <div>
                  <p className="font-medium text-gray-900">Invoice #{new Date().getFullYear()}-00{i}</p>
                  <p className="text-sm text-gray-500">Mar {i}, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">KES 15,000</span>
                <Download className="w-4 h-4 text-gray-400 hover:text-orange-600 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;