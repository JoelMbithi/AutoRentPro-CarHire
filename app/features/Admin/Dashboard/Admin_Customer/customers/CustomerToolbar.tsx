"use client";

import React from 'react';
import { Search, Download, RefreshCw, UserPlus } from 'lucide-react';
import { TABS } from './helpers';

interface CustomerToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (key: string) => void;
  tabCounts: Record<string, number>;
  onRefresh: () => void;
  onAddCustomer: () => void;
  onExport: () => void;
  loading: boolean;
}

export const CustomerToolbar: React.FC<CustomerToolbarProps> = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  tabCounts,
  onRefresh,
  onAddCustomer,
  onExport,
  loading,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap px-4 py-3 border-b border-gray-100">
      {/* tabs */}
      <div className="flex gap-1 flex-1 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => onRoleFilterChange(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              roleFilter === t.key
                ? 'bg-gray-900 text-white'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            {t.label}
            <span className="ml-1 text-xs opacity-50">{tabCounts[t.key] || 0}</span>
          </button>
        ))}
      </div>

      {/* search */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onRefresh()}
          placeholder="Search…"
          className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none focus:border-gray-400 w-44"
        />
      </div>

      <button
        onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Download size={13} /> Export
      </button>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40"
      >
        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        Refresh
      </button>

      <button
        onClick={onAddCustomer}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        <UserPlus size={13} />
        Add Customer
      </button>
    </div>
  );
};