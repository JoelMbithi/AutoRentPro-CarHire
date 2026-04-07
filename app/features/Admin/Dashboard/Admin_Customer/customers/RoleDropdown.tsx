"use client";

import React, { useState } from 'react';
import { Shield, UserCog, Crown, Check } from 'lucide-react';

interface RoleDropdownProps {
  currentRole: string;
  onRoleChange: (newRole: string) => void;
  customerName: string;
}

const roles = [
  { value: 'CUSTOMER', label: 'Customer', icon: UserCog, color: 'text-gray-600', bgClass: 'bg-gray-100 text-gray-600' },
  { value: 'AGENT', label: 'Agent', icon: Shield, color: 'text-emerald-600', bgClass: 'bg-emerald-50 text-emerald-700' },
  { value: 'ADMIN', label: 'Admin', icon: Crown, color: 'text-red-600', bgClass: 'bg-red-50 text-red-700' },
];

export const RoleDropdown: React.FC<RoleDropdownProps> = ({ currentRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentStyle = () => {
    const role = roles.find(r => r.value === currentRole);
    return role?.bgClass || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${getCurrentStyle()}`}
      >
        {currentRole}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => {
                if (role.value !== currentRole) {
                  onRoleChange(role.value);
                }
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                role.value === currentRole ? 'bg-gray-50 text-gray-900' : role.color
              }`}
            >
              <role.icon size={14} />
              {role.label}
              {role.value === currentRole && <Check size={12} className="ml-auto text-green-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};