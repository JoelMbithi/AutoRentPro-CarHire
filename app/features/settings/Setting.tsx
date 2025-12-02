"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Lock, Mail, User, Phone, Shield, Bell, Globe, CreditCard, Car } from 'lucide-react';

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
  
  // Add state for account data
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    bookingUpdates: true,
    promotional: false,
    priceAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    allowMessages: true,
    showRecentBookings: false,
    dataSharing: false,
  });

  const [preferences, setPreferences] = useState({
    preferredVehicleType: 'SUV',
    defaultPickupLocation: '',
    defaultPaymentMethod: 'card',
    language: 'en',
    currency: 'USD',
    theme: 'light',
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    autoLogout: true,
    sessionTimeout: 30,
  });

  // Fetch settings when component opens
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
        // Set account data from user
        setAccountData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
        });

        // Set settings from API
        if (data.settings.notifications) {
          setNotifications(data.settings.notifications);
        }
        if (data.settings.privacy) {
          setPrivacy(data.settings.privacy);
        }
        if (data.settings.preferences) {
          setPreferences(data.settings.preferences);
        }
        if (data.settings.security) {
          setSecurity(data.settings.security);
        }
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
      // Prepare data based on active tab
      let requestBody: any = { tab: activeTab };

      switch (activeTab) {
        case 'account':
          requestBody.accountData = accountData;
          break;
        case 'notifications':
          requestBody.notifications = notifications;
          break;
        case 'privacy':
          requestBody.privacy = privacy;
          break;
        case 'preferences':
          requestBody.preferences = preferences;
          break;
        case 'security':
          requestBody.security = security;
          break;
      }

      const response = await fetch('/features/settings/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Settings saved successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
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

  const handleReset = async () => {
    // Reset to default settings
    const defaultSettings = {
      notifications: {
        email: true,
        sms: true,
        bookingUpdates: true,
        promotional: false,
        priceAlerts: true,
      },
      privacy: {
        showProfile: true,
        allowMessages: true,
        showRecentBookings: false,
        dataSharing: false,
      },
      preferences: {
        preferredVehicleType: 'SUV',
        defaultPickupLocation: '',
        defaultPaymentMethod: 'card',
        language: 'en',
        currency: 'USD',
        theme: 'light',
      },
      security: {
        twoFactorAuth: false,
        loginAlerts: true,
        autoLogout: true,
        sessionTimeout: 30,
      }
    };

    setNotifications(defaultSettings.notifications);
    setPrivacy(defaultSettings.privacy);
    setPreferences(defaultSettings.preferences);
    setSecurity(defaultSettings.security);

    // Save reset settings to API
    await handleSave();
  };

  const handleAccountChange = (field: string, value: string) => {
    setAccountData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Car size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-purple-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold backdrop-blur-sm border border-white/30">
                {user?.firstName?.charAt(0) || 'U'}
                {user?.lastName?.charAt(0) || ''}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Settings & Preferences
              </h1>
              <p className="text-orange-200 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email || 'User Settings'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-64 bg-gray-50 rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Settings</h2>
                <p className="text-gray-600 text-sm">Manage your preferences</p>
              </div>

              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* User Info Card */}
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl border border-orange-100">
                <div className="text-center">
                  <p className="font-semibold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Content based on active tab */}
              <div className="space-y-6">
                {activeTab === 'account' && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-600" />
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={accountData.firstName}
                          onChange={(e) => handleAccountChange('firstName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={accountData.lastName}
                          onChange={(e) => handleAccountChange('lastName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={accountData.email}
                            onChange={(e) => handleAccountChange('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all pr-12"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Mail size={20} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={accountData.phone}
                            onChange={(e) => handleAccountChange('phone', e.target.value)}
                            placeholder="+(254) 743 861 565"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all pr-12"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Phone size={20} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-orange-600" />
                      Notification Settings
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-4 bg-white rounded-xl border hover:border-orange-300 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-800 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Receive {key.toLowerCase()} notifications
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  [key]: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-600" />
                      Privacy Settings
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(privacy).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-4 bg-white rounded-xl border hover:border-orange-300 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-800 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Control your {key.toLowerCase()} settings
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setPrivacy({
                                  ...privacy,
                                  [key]: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Car className="w-5 h-5 text-orange-600" />
                      Preferences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Preferred Vehicle Type
                        </label>
                        <select
                          value={preferences.preferredVehicleType}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              preferredVehicleType: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="SUV">SUV</option>
                          <option value="Sedan">Sedan</option>
                          <option value="Convertible">Convertible</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Economy">Economy</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Default Payment Method
                        </label>
                        <select
                          value={preferences.defaultPaymentMethod}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              defaultPaymentMethod: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="card">Credit Card</option>
                          <option value="mpesa">Mpesa</option>
                          <option value="paypal">PayPal</option>
                          <option value="cash">Cash</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Language
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              language: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="en">English</option>
                          <option value="sw">Swahili</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Currency
                        </label>
                        <select
                          value={preferences.currency}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              currency: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="KES">KEN (Ksh)</option>
                          <option value="USD">USD ($)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-orange-600" />
                      Security Settings
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(security).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-4 bg-white rounded-xl border hover:border-orange-300 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 capitalize">
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
                                  onChange={(e) =>
                                    setSecurity({
                                      ...security,
                                      sessionTimeout: parseInt(e.target.value),
                                    })
                                  }
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
                                onChange={(e) =>
                                  setSecurity({
                                    ...security,
                                    [key]: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      Billing & Payment
                    </h3>
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl border border-orange-100">
                        <h4 className="font-bold text-gray-900 text-lg mb-4">
                          Payment Methods
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border hover:border-orange-300 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CreditCard size={20} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-gray-500">Expires 12/25</p>
                              </div>
                            </div>
                            <button className="text-orange-600 hover:text-orange-700 font-medium px-3 py-1 rounded-md hover:bg-orange-50 transition-colors">
                              Edit
                            </button>
                          </div>
                          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors text-gray-600 hover:text-orange-600">
                            + Add New Payment Method
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-8 mt-6 border-t border-gray-200">
                <button
                  onClick={handleReset}
                  disabled={saveLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset to Default
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={saveLoading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saveLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;