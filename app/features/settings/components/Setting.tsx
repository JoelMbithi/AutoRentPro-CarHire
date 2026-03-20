"use client";

import React, { useState, useEffect } from 'react';
import {
  X, Save, Lock, Mail, Phone, Bell, Car, ChevronLeft,
  Moon, Sun, Eye, EyeOff, CreditCard, Smartphone, Download,
  Shield, User, Database
} from 'lucide-react';

interface SettingProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const toggleClass = "w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-orange-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4";
const inputClass  = 'w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-orange-400 transition';
const labelClass  = 'block text-sm text-gray-500 mb-1';
const selectClass = 'w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-orange-400 transition';

const Setting = ({ isOpen, onClose, user }: SettingProps) => {
  const [saveLoading, setSaveLoading]   = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState<string | null>(null);
  const [activeTab, setActiveTab]       = useState('account');

  const [accountData, setAccountData] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  const [notifications, setNotifications] = useState({
    emailNotifications: true, smsNotifications: true, pushNotifications: true,
    bookingConfirmations: true, bookingReminders: true, paymentReceipts: true,
    promotionalOffers: false, priceDropAlerts: true, systemUpdates: true, securityAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', showBookingHistory: false,
    allowContactByOtherUsers: true, shareAnalytics: false,
    showOnlineStatus: true, allowProfileSearch: true,
    dataRetentionPeriod: '90', autoDeleteInactiveData: true,
  });

  const [preferences, setPreferences] = useState({
    preferredVehicleType: 'SUV', defaultPickupLocation: '',
    defaultPaymentMethod: 'card', language: 'en', currency: 'KES',
    theme: 'light', timezone: 'Africa/Nairobi', dateFormat: 'DD/MM/YYYY',
    measurementSystem: 'metric', autoConfirmBookings: false,
    defaultRentalDuration: '7', favoriteLocations: [] as string[],
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false, twoFactorMethod: 'sms',
    loginAlerts: true, autoLogout: true, sessionTimeout: 30,
    requirePasswordChange: false, passwordChangeDays: 90,
    lastPasswordChange: '', trustedDevices: [] as string[], loginHistory: [] as any[],
  });

  const [billing, setBilling] = useState({
    defaultPaymentMethod: 'card', savePaymentMethods: true,
    autoRenewMembership: true, invoiceDelivery: 'email', taxReceipts: true,
    billingAddress: { street: '', city: '', state: '', zipCode: '', country: 'Kenya' },
    vatNumber: '', companyName: '',
  });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen && user) fetchSettings();
  }, [isOpen, user]);

  const fetchSettings = async () => {
    setIsLoading(true); setError(null);
    try {
      const res  = await fetch('/features/settings/api/settings', { method: 'GET', credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setAccountData({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '', phone: user.phone || '' });
        if (data.settings.notifications) setNotifications(data.settings.notifications);
        if (data.settings.privacy)       setPrivacy(data.settings.privacy);
        if (data.settings.preferences)   setPreferences(data.settings.preferences);
        if (data.settings.security)      setSecurity(data.settings.security);
        if (data.settings.billing)       setBilling(data.settings.billing);
      } else { setError(data.error || 'Failed to fetch settings'); }
    } catch { setError('An error occurred while fetching settings'); }
    finally { setIsLoading(false); }
  };

  const handleSave = async () => {
    setSaveLoading(true); setError(null); setSuccess(null);
    try {
      const res  = await fetch('/features/settings/api/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({
          tab: activeTab,
          accountData:   activeTab === 'account'        ? accountData   : undefined,
          notifications: activeTab === 'notifications'  ? notifications : undefined,
          privacy:       activeTab === 'privacy'        ? privacy       : undefined,
          preferences:   activeTab === 'preferences'    ? preferences   : undefined,
          security:      activeTab === 'security'       ? security      : undefined,
          billing:       activeTab === 'billing'        ? billing       : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setSuccess('Settings saved.'); setTimeout(() => setSuccess(null), 3000); }
      else { setError(data.error || 'Failed to save settings'); }
    } catch { setError('An error occurred while saving settings'); }
    finally { setSaveLoading(false); }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) { setError('New passwords do not match'); return; }
    if (passwords.newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setSaveLoading(true); setError(null); setSuccess(null);
    try {
      const res  = await fetch('/features/settings/api/settings/password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Password updated.');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(null), 3000);
      } else { setError(data.error || 'Failed to update password'); }
    } catch { setError('An error occurred'); }
    finally { setSaveLoading(false); }
  };

  const tabs = [
    { id: 'account',       label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy',       label: 'Privacy' },
    { id: 'preferences',   label: 'Preferences' },
    { id: 'security',      label: 'Security' },
    { id: 'billing',       label: 'Billing' },
  ];

  if (!isOpen) return null;

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-base font-semibold text-gray-900">Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={saveLoading || isLoading} className="inline-flex items-center gap-1.5 bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50">
              <Save className="w-3.5 h-3.5" /> {saveLoading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <div className="lg:w-52 shrink-0">
          <div className="bg-white border border-gray-200 rounded p-4 mb-4">
            <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'}
            </p>
          </div>
          <nav className="flex flex-col gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-50 text-orange-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {error   && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">{success}</div>}

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded p-6">

              {/* Account */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-5">Account Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className={labelClass}>First name</label>
                      <input type="text" value={accountData.firstName} onChange={(e) => setAccountData({...accountData, firstName: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last name</label>
                      <input type="text" value={accountData.lastName} onChange={(e) => setAccountData({...accountData, lastName: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input type="email" value={accountData.email} onChange={(e) => setAccountData({...accountData, email: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input type="tel" value={accountData.phone} placeholder="+254 700 000 000" onChange={(e) => setAccountData({...accountData, phone: e.target.value})} className={inputClass} />
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Actions</h3>
                    <div className="flex gap-3">
                      <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors">Deactivate Account</button>
                      <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export Data</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-5">Notification Preferences</h2>
                  <div className="flex flex-col divide-y divide-gray-100">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm text-gray-900">{key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={value} onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})} className="sr-only peer" />
                          <div className={toggleClass} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-5">Privacy Settings</h2>

                  <div className="mb-6">
                    <label className={labelClass}>Profile visibility</label>
                    <select value={privacy.profileVisibility} onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})} className={`${selectClass} max-w-xs`}>
                      <option value="public">Public</option>
                      <option value="contacts">Contacts only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="flex flex-col divide-y divide-gray-100">
                    {Object.entries(privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3">
                        <p className="text-sm text-gray-900">{key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</p>
                        {typeof value === 'boolean' ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={value} onChange={(e) => setPrivacy({...privacy, [key]: e.target.checked})} className="sr-only peer" />
                            <div className={toggleClass} />
                          </label>
                        ) : (
                          <select value={value as string} onChange={(e) => setPrivacy({...privacy, [key]: e.target.value})} className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-orange-400">
                            {key === 'dataRetentionPeriod' && (<>
                              <option value="30">30 days</option>
                              <option value="90">90 days</option>
                              <option value="365">1 year</option>
                            </>)}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-5">Preferences</h2>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className={labelClass}>Preferred vehicle type</label>
                      <select value={preferences.preferredVehicleType} onChange={(e) => setPreferences({...preferences, preferredVehicleType: e.target.value})} className={selectClass}>
                        {['SUV','Sedan','Hatchback','Convertible','Luxury','Economy','Minivan','Truck'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Default rental duration</label>
                      <select value={preferences.defaultRentalDuration} onChange={(e) => setPreferences({...preferences, defaultRentalDuration: e.target.value})} className={selectClass}>
                        {['1','3','7','14','30'].map(v => <option key={v} value={v}>{v} day{Number(v) > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Language</label>
                      <select value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})} className={selectClass}>
                        <option value="en">English</option>
                        <option value="sw">Swahili</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Currency</label>
                      <select value={preferences.currency} onChange={(e) => setPreferences({...preferences, currency: e.target.value})} className={selectClass}>
                        <option value="KES">Kenyan Shilling (KES)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Measurement system</label>
                      <select value={preferences.measurementSystem} onChange={(e) => setPreferences({...preferences, measurementSystem: e.target.value})} className={selectClass}>
                        <option value="metric">Metric (km, °C)</option>
                        <option value="imperial">Imperial (miles, °F)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Theme</label>
                      <div className="flex gap-2">
                        <button onClick={() => setPreferences({...preferences, theme: 'light'})} className={`flex items-center gap-2 px-4 py-2 rounded border text-sm transition-colors ${preferences.theme === 'light' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          <Sun className="w-3.5 h-3.5" /> Light
                        </button>
                        <button onClick={() => setPreferences({...preferences, theme: 'dark'})} className={`flex items-center gap-2 px-4 py-2 rounded border text-sm transition-colors ${preferences.theme === 'dark' ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          <Moon className="w-3.5 h-3.5" /> Dark
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-900">Auto-confirm bookings</p>
                      <p className="text-xs text-gray-400 mt-0.5">Skip the review step when booking</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={preferences.autoConfirmBookings} onChange={(e) => setPreferences({...preferences, autoConfirmBookings: e.target.checked})} className="sr-only peer" />
                      <div className={toggleClass} />
                    </label>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-5">Security</h2>

                  <div className="mb-7">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Change Password</h3>
                    <div className="space-y-3 max-w-sm">
                      {[
                        { show: showCurrentPassword, toggle: () => setShowCurrentPassword(v => !v), placeholder: 'Current password', key: 'currentPassword' },
                        { show: showNewPassword,     toggle: () => setShowNewPassword(v => !v),     placeholder: 'New password',      key: 'newPassword' },
                        { show: showConfirmPassword, toggle: () => setShowConfirmPassword(v => !v), placeholder: 'Confirm password',  key: 'confirmPassword' },
                      ].map((field) => (
                        <div key={field.key} className="relative">
                          <input
                            type={field.show ? 'text' : 'password'}
                            placeholder={field.placeholder}
                            value={(passwords as any)[field.key]}
                            onChange={(e) => setPasswords({...passwords, [field.key]: e.target.value})}
                            className={`${inputClass} pr-9`}
                          />
                          <button onClick={field.toggle} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      ))}
                      <button onClick={handlePasswordChange} disabled={saveLoading} className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col divide-y divide-gray-100 border-t border-gray-100">
                    {Object.entries(security).filter(([, v]) => typeof v === 'boolean').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3">
                        <p className="text-sm text-gray-900">{key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={value as boolean} onChange={(e) => setSecurity({...security, [key]: e.target.checked})} className="sr-only peer" />
                          <div className={toggleClass} />
                        </label>
                      </div>
                    ))}
                    <div className="py-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-900">Session timeout</p>
                        <span className="text-sm font-medium text-gray-900">{security.sessionTimeout} min</span>
                      </div>
                      <input type="range" min="5" max="120" step="5" value={security.sessionTimeout} onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})} className="w-full max-w-xs accent-orange-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Billing */}
              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-5">Billing & Payment</h2>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className={labelClass}>Default payment method</label>
                      <select value={billing.defaultPaymentMethod} onChange={(e) => setBilling({...billing, defaultPaymentMethod: e.target.value})} className={selectClass}>
                        <option value="card">Credit/Debit Card</option>
                        <option value="mpesa">M-Pesa</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Invoice delivery</label>
                      <select value={billing.invoiceDelivery} onChange={(e) => setBilling({...billing, invoiceDelivery: e.target.value})} className={selectClass}>
                        <option value="email">Email only</option>
                        <option value="email_sms">Email & SMS</option>
                        <option value="postal">Postal mail</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col divide-y divide-gray-100 mb-8">
                    {[
                      { key: 'savePaymentMethods', label: 'Save payment methods', desc: 'Securely save payment details for faster checkout' },
                      { key: 'autoRenewMembership', label: 'Auto-renew membership', desc: 'Automatically renew when membership expires' },
                      { key: 'taxReceipts', label: 'Tax receipts', desc: 'Receive tax receipts for business expenses' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm text-gray-900">{label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={(billing as any)[key]} onChange={(e) => setBilling({...billing, [key]: e.target.checked})} className="sr-only peer" />
                          <div className={toggleClass} />
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Saved payment methods */}
                  <div className="pt-5 border-t border-gray-100 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Payment Methods</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-xs text-gray-400">Expires 12/25</p>
                          </div>
                        </div>
                        <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">Default</span>
                      </div>
                      <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900">M-Pesa</p>
                            <p className="text-xs text-gray-400">+254 712 345 678</p>
                          </div>
                        </div>
                        <button className="text-xs text-orange-600 hover:underline">Set as default</button>
                      </div>
                      <button className="text-sm text-gray-500 hover:text-orange-600 transition-colors mt-1">+ Add payment method</button>
                    </div>
                  </div>

                  {/* Recent invoices */}
                  <div className="pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Recent Invoices</h3>
                      <button className="text-xs text-orange-600 hover:underline">View all</button>
                    </div>
                    <div className="flex flex-col divide-y divide-gray-50">
                      {[1,2,3].map((i) => (
                        <div key={i} className="flex items-center justify-between py-2.5">
                          <div>
                            <p className="text-sm text-gray-900">Invoice #{new Date().getFullYear()}-00{i}</p>
                            <p className="text-xs text-gray-400">Mar {i}, 2024</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-900">KES 15,000</span>
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
  );
};

export default Setting;