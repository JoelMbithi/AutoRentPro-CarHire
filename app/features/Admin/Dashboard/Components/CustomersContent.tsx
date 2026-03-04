"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { UserPlus, Eye, Edit, Mail, Trash2, Download, RefreshCw, Search } from 'lucide-react';
import { dashboardService, Customer } from '@/app/features/Admin/Dashboard/api/dashboardService';
import { useRouter } from 'next/navigation';

// ── helpers ──────────────────────────────────────────────────────────────────
const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const AVATAR_COLORS = ['bg-orange-400', 'bg-blue-400', 'bg-violet-400', 'bg-emerald-400', 'bg-pink-400', 'bg-amber-400'];
const avatarColor = (id: string) => AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

const ROLE_STYLES: Record<string, string> = {
  VIP:      'bg-violet-50 text-violet-700',
  PREMIUM:  'bg-blue-50 text-blue-700',
  ADMIN:    'bg-red-50 text-red-700',
  AGENT:    'bg-emerald-50 text-emerald-700',
  CUSTOMER: 'bg-gray-100 text-gray-600',
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ── component ─────────────────────────────────────────────────────────────────
export default function CustomersContent() {
  const router = useRouter();

  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState('all');
  const [customers, setCustomers]     = useState<Customer[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [stats, setStats]             = useState({ totalCustomers: 0, activeCustomers: 0, vipMembers: 0, avgRating: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // ── data fetching ────────────────────────────────────────────────────────
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await dashboardService.getAllCustomers(1, 50, {
        search,
        type: roleFilter !== 'all' ? roleFilter : '',
      });
      const raw = res?.success && Array.isArray(res.data) ? res.data
                : Array.isArray(res) ? res : [];
      setCustomers(raw.map((u: any) => ({
        id:           u.id,
        customerId:   `C${u.id.toString().padStart(3, '0')}`,
        name:         `${u.firstName} ${u.lastName}`,
        email:        u.email,
        phone:        u.phone || '—',
        role:         u.role,
        customerType: u.role,
        status:       u.isVerified ? 'active' : 'inactive',
        isVerified:   u.isVerified,
        totalSpent:   u.bookings?.reduce((s: number, b: any) => s + (b.totalPrice || 0), 0) || 0,
        bookings:     u._count?.bookings || 0,
        valueScore:   '4.5',
        joinedDate:   u.createdAt,
        lastBooking:  u.bookings?.[0]?.createdAt || null,
        userProfile:  u.userProfile,
        _count:       u._count,
        bookingsArray: u.bookings || [],
      })));
    } catch {
      setError('Could not load customers.');
      setCustomers([]);
    } finally { setLoading(false); }
  }, [search, roleFilter]);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await dashboardService.getCustomerStats();
      setStats({
        totalCustomers: data?.totalCustomers || 0,
        activeCustomers: data?.activeCustomers || 0,
        vipMembers: data?.vipMembers || 0,
        avgRating: data?.avgRating || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalCustomers: 0, activeCustomers: 0, vipMembers: 0, avgRating: 0 });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); fetchStats(); }, [fetchCustomers, fetchStats]);

  // ── actions ───────────────────────────────────────────────────────────────
  const handleDelete = async (customerId: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await dashboardService.deleteCustomer(parseInt(customerId.replace('C', '')));
      fetchCustomers();
    } catch { alert('Could not delete customer.'); }
  };

  // ── derived ───────────────────────────────────────────────────────────────
  const TABS = [
    { key: 'all',      label: 'All' },
    { key: 'CUSTOMER', label: 'Customer' },
    { key: 'PREMIUM',  label: 'Premium' },
    { key: 'VIP',      label: 'VIP' },
    { key: 'ADMIN',    label: 'Admin' },
    { key: 'AGENT',    label: 'Agent' },
  ];

  const tabCount = (key: string) =>
    key === 'all' ? customers.length : customers.filter(c => c.role === key).length;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ── header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {statsLoading ? '—' : `${stats.totalCustomers} total · ${stats.activeCustomers} verified · ${stats.vipMembers} VIP`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { fetchCustomers(); fetchStats(); }}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => alert('Open add customer form')}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <UserPlus size={13} />
            Add customer
          </button>
        </div>
      </div>

      {/* ── error ── */}
      {error && (
        <div className="flex items-center justify-between mb-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
          <button onClick={fetchCustomers} className="underline text-xs ml-4">Retry</button>
        </div>
      )}

      {/* ── main card ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* toolbar */}
        <div className="flex items-center gap-2 flex-wrap px-4 py-3 border-b border-gray-100">
          {/* tabs */}
          <div className="flex gap-1 flex-1 flex-wrap">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setRoleFilter(t.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  roleFilter === t.key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {t.label}
                <span className="ml-1 text-xs opacity-50">{tabCount(t.key)}</span>
              </button>
            ))}
          </div>

          {/* search */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchCustomers()}
              placeholder="Search…"
              className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none focus:border-gray-400 w-44"
            />
          </div>

          <button
            onClick={() => alert('Export')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Download size={13} /> Export
          </button>
        </div>

        {/* ── loading ── */}
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-300">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto mb-3" />
            Loading…
          </div>

        /* ── empty ── */
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-300">
            No customers found
            <br />
            <button onClick={fetchCustomers} className="mt-3 px-4 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors">
              Refresh
            </button>
          </div>

        /* ── table ── */
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Customer', 'Email', 'Phone', 'Role', 'Bookings', 'Spent', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-300 whitespace-nowrap last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.customerId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">

                    {/* name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${avatarColor(c.customerId)} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{c.name}</div>
                          <div className="text-xs text-gray-300 font-mono">{c.customerId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-500">{c.email}</td>

                    <td className="px-4 py-3 text-gray-400">{c.phone}</td>

                    {/* role */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[c.role] ?? ROLE_STYLES.CUSTOMER}`}>
                        {c.role}
                      </span>
                    </td>

                    {/* bookings */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-700">{c.bookings}</span>
                      {c.lastBooking && (
                        <div className="text-xs text-gray-300 mt-0.5">{fmtDate(c.lastBooking)}</div>
                      )}
                    </td>

                    {/* spent */}
                    <td className="px-4 py-3 font-mono text-gray-800">
                      ksh {Number(c.totalSpent).toLocaleString()}
                    </td>

                    {/* status */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                        <span className={`text-xs ${c.status === 'active' ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {c.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>

                    {/* actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {[
                          { icon: <Eye size={14} />,     color: 'text-gray-400', title: 'View',   fn: () => router.push(`/dashboard/customers/${c.id}`) },
                          { icon: <Edit size={14} />,    color: 'text-blue-400', title: 'Edit',   fn: () => alert(`Edit: ${c.name}`) },
                          { icon: <Mail size={14} />,    color: 'text-orange-400', title: 'Email', fn: () => window.location.href = `mailto:${c.email}` },
                          { icon: <Trash2 size={14} />,  color: 'text-red-400',  title: 'Delete', fn: () => handleDelete(c.customerId, c.name) },
                        ].map((btn, i) => (
                          <button
                            key={i}
                            title={btn.title}
                            onClick={btn.fn}
                            className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${btn.color}`}
                          >
                            {btn.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* footer - FIXED: Added safe check for avgRating */}
        {!loading && customers.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between text-xs text-gray-300">
            <span>
              {customers.length} customer{customers.length !== 1 ? 's' : ''}
              {roleFilter !== 'all' && ` · ${roleFilter.toLowerCase()}`}
            </span>
            <span>
              Avg rating {statsLoading ? '—' : (stats.avgRating ? stats.avgRating.toFixed(1) : '0.0')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}