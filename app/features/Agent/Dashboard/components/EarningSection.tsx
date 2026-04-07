"use client";

import React from 'react';
import { TrendingUp, Calendar, Clock } from 'lucide-react';

interface EarningsSectionProps {
  earnings: { total: number; monthly: number; pending: number };
  bookings: any[];
}

const EarningsSection: React.FC<EarningsSectionProps> = ({ earnings, bookings }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Earnings</span>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">KSH {earnings.total.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Lifetime earnings</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">This Month</span>
            <Calendar size={20} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">KSH {earnings.monthly.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Current month earnings</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Pending Payout</span>
            <Clock size={20} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">KSH {earnings.pending.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Awaiting settlement</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        {bookings.filter(b => b.status === 'completed').length === 0 ? (
          <p className="text-center text-gray-400 py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {bookings.filter(b => b.status === 'completed').map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.vehicleName}</p>
                  <p className="text-xs text-gray-400">{new Date(booking.endDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{booking.amount}</p>
                  <p className="text-xs text-emerald-600">Your earnings: KSH {(parseInt(booking.amount) * 0.85).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsSection;