"use client";

import React from 'react';

interface StatusPillProps {
  status: string;
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const config: any = {
    available: { label: 'Available', class: 'bg-emerald-50 text-emerald-600' },
    rented: { label: 'Rented', class: 'bg-orange-50 text-orange-700' },
    maintenance: { label: 'In Service', class: 'bg-yellow-50 text-yellow-700' },
    completed: { label: 'Completed', class: 'bg-blue-50 text-blue-600' },
    cancelled: { label: 'Cancelled', class: 'bg-red-50 text-red-600' },
  };
  const cfg = config[status] || config.available;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cfg.class}`}>
      {cfg.label}
    </span>
  );
};

export default StatusPill;