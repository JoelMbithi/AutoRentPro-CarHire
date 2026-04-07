"use client";

import React from 'react';

interface SettingsSectionProps {
  user: any;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ user }) => {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your profile information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Avatar Section */}
        <div className="bg-orange-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-sm text-gray-500">Car Owner</p>
            </div>
          </div>
        </div>

        {/* Info Fields */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={`${user?.firstName || ''} ${user?.lastName || ''}`} 
              disabled 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700" 
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700" 
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              value={user?.phone || ''} 
              disabled 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700" 
            />
          </div>

          {/* Commission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate</label>
            <input 
              type="text" 
              value="15%" 
              disabled 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700" 
            />
            <p className="text-xs text-gray-400 mt-1">Standard commission rate for all owners</p>
          </div>

          {/* Verification Status */}
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${user?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm text-gray-600">
                {user?.isVerified ? 'Verified Account' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;