"use client";

import React from 'react';
import { Shield } from 'lucide-react';

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
  currentRole: string;
  newRole: string;
  loading?: boolean;
}

export const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  currentRole,
  newRole,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-full">
            <Shield size={24} className="text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Change User Role</h3>
        </div>
        <p className="text-gray-600 mb-2">
          Are you sure you want to change <span className="font-semibold">{customerName}</span>'s role from 
          <span className="font-semibold text-orange-600"> {currentRole}</span> to 
          <span className="font-semibold text-emerald-600"> {newRole}</span>?
        </p>
        <p className="text-sm text-gray-400 mb-6">
          {newRole === 'ADMIN' && 'This will give the user full admin access to the dashboard.'}
          {newRole === 'AGENT' && 'This will allow the user to list and manage cars as an agent.'}
          {newRole === 'CUSTOMER' && 'This will restrict the user to customer-only access.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Confirm Change'}
          </button>
        </div>
      </div>
    </div>
  );
};