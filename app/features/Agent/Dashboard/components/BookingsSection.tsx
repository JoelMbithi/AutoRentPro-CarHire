"use client";

import React from 'react';
import { Calendar } from 'lucide-react';
import StatusPill from './StatusPill';

interface BookingsSectionProps {
  bookings: any[];
}

const BookingsSection: React.FC<BookingsSectionProps> = ({ bookings }) => {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-500">Track your car rentals and bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">No bookings yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Vehicle</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Dates</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-xs text-gray-400">{booking.customerEmail}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-900">{booking.vehicleName}</p>
                    <p className="text-xs text-gray-400">{booking.plateNumber}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-900">From: {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">To: {new Date(booking.endDate).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-gray-900">{booking.amount}</p>
                  </td>
                  <td className="p-4">
                    <StatusPill status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsSection;