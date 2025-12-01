import React, { useState, useEffect } from 'react';
import { X, Save, Lock, Mail, User, Phone, Shield, Bell, Globe, CreditCard, Car } from 'lucide-react';

interface SettingProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const Setting = ({ isOpen, onClose, user }: SettingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
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

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Here you would typically update user settings via API
  };

  const handleReset = () => {
    // Reset to default settings
    setNotifications({
      email: true,
      sms: true,
      bookingUpdates: true,
      promotional: false,
      priceAlerts: true,
    });
    setPrivacy({
      showProfile: true,
      allowMessages: true,
      showRecentBookings: false,
      dataSharing: false,
    });
    setPreferences({
      preferredVehicleType: 'SUV',
      defaultPickupLocation: '',
      defaultPaymentMethod: 'card',
      language: 'en',
      currency: 'USD',
      theme: 'light',
    });
    setSecurity({
      twoFactorAuth: false,
      loginAlerts: true,
      autoLogout: true,
      sessionTimeout: 30,
    });
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
    <div className="fixed inset-0 z-[200] overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Settings Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex animate-scale-in">
          {/* Sidebar */}
          <div className="w-64 bg-gradient-to-b from-orange-50 to-white border-r border-gray-200 p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage your account preferences
              </p>
            </div>

            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl border border-orange-100">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg font-bold">
                  {user?.firstName?.charAt(0) || 'U'}
                  {user?.lastName?.charAt(0) || ''}
                </span>
              </div>
              <p className="text-center font-semibold text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-center text-sm text-gray-500 mt-1">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 capitalize">
                  {tabs.find(t => t.id === activeTab)?.label} Settings
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Customize your {activeTab} preferences
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content based on active tab */}
            <div className="space-y-6">
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.firstName || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.lastName || ''}
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
                          defaultValue={user?.email || ''}
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
                           defaultValue={user?.phone || ''}
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
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
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
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  {Object.entries(privacy).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
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
              )}

              {activeTab === 'preferences' && (
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
                      <option value="paypal">PayPal</option>
                      <option value="applepay">Mpesa</option>
                      <option value="googlepay">Cash</option>
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
                      <option value="es">Swahili</option>
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
                      <option value="EUR">KEN (Ksh)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  {Object.entries(security).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {key === 'sessionTimeout'
                            ? 'Minutes before automatic logout'
                            : `Enable ${key.toLowerCase()} for added security`}
                        </p>
                        {key === 'sessionTimeout' && (
                          <div className="mt-2">
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
                              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>5 min</span>
                              <span>{value} min</span>
                              <span>120 min</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {typeof value === 'boolean' && (
                        <label className="relative inline-flex items-center cursor-pointer">
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
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl border border-orange-100">
                    <h4 className="font-bold text-gray-900 text-lg mb-4">
                      Payment Methods
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/25</p>
                          </div>
                        </div>
                        <button className="text-orange-600 hover:text-orange-700 font-medium">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Reset to Default
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
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
      </div>
    </div>
  );
};

export default Setting;