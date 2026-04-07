"use client";

import React, { useState } from 'react';
import { Eye, Edit, Mail, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { initials, avatarColor, fmtDate } from './helpers';
import { RoleDropdown } from './RoleDropdown';
import { Customer } from '../../api/dashboardService';

interface CustomerTableProps {
  customers: Customer[];
  onRoleChange: (customer: Customer, newRole: string) => void;
  onDelete: (customerId: string, name: string) => void;
  onView: (customerId: number) => void;
  onEdit: (customer: Customer) => void;
  onVerify?: (customerId: number, isVerified: boolean) => void;
}

const TableRow: React.FC<{
  customer: Customer;
  onRoleChange: (customer: Customer, newRole: string) => void;
  onDelete: (customerId: string, name: string) => void;
  onView: (customerId: number) => void;
  onEdit: (customer: Customer) => void;
  onVerify?: (customerId: number, isVerified: boolean) => void;
}> = ({ customer, onRoleChange, onDelete, onView, onEdit, onVerify }) => {
  const safeCustomerId = customer.customerId || `C${customer.id.toString().padStart(3, '0')}`;
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!onVerify) return;
    setIsVerifying(true);
    await onVerify(customer.id, !customer.isVerified);
    setIsVerifying(false);
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">
      {/* name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full ${avatarColor(safeCustomerId)} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
            {initials(customer.name)}
          </div>
          <div>
            <div className="font-medium text-gray-800">{customer.name}</div>
            <div className="text-xs text-gray-300 font-mono">{safeCustomerId}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-gray-500">{customer.email}</td>
      <td className="px-4 py-3 text-gray-400">{customer.phone}</td>

      {/* role with dropdown */}
      <td className="px-4 py-3">
        <RoleDropdown
          currentRole={customer.role}
          onRoleChange={(newRole) => onRoleChange(customer, newRole)}
          customerName={customer.name}
        />
      </td>

      {/* bookings */}
      <td className="px-4 py-3">
        <span className="font-medium text-gray-700">{customer.bookings}</span>
        {customer.lastBooking && (
          <div className="text-xs text-gray-300 mt-0.5">{fmtDate(new Date(customer.lastBooking).toISOString().split('T')[0])}</div>
        )}
      </td>

      {/* spent */}
      <td className="px-4 py-3 font-mono text-gray-800">
        ksh {Number(customer.totalSpent).toLocaleString()}
      </td>

      {/* verification status with toggle button */}
      <td className="px-4 py-3">
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            customer.isVerified
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
          }`}
        >
          {customer.isVerified ? (
            <CheckCircle size={12} />
          ) : (
            <XCircle size={12} />
          )}
          {isVerifying ? '...' : (customer.isVerified ? 'Verified' : 'Pending')}
        </button>
      </td>

      {/* actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            title="View"
            onClick={() => onView(customer.id)}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-400"
          >
            <Eye size={14} />
          </button>
          <button
            title="Edit"
            onClick={() => onEdit(customer)}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-blue-400"
          >
            <Edit size={14} />
          </button>
          <button
            title="Email"
            onClick={() => window.location.href = `mailto:${customer.email}`}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-orange-400"
          >
            <Mail size={14} />
          </button>
          <button
            title="Delete"
            onClick={() => onDelete(safeCustomerId, customer.name)}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onRoleChange,
  onDelete,
  onView,
  onEdit,
  onVerify,
}) => {
  if (customers.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-300">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {['User', 'Email', 'Phone', 'Role', 'Bookings', 'Spent', 'Status', ''].map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-300 whitespace-nowrap last:text-right">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <TableRow
              key={c.id}
              customer={c}
              onRoleChange={onRoleChange}
              onDelete={onDelete}
              onView={onView}
              onEdit={onEdit}
              onVerify={onVerify}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};