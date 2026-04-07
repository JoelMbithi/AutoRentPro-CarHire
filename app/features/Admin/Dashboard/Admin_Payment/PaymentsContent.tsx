"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Download, Eye, FileText, RefreshCw, Search, CreditCard, AlertCircle, Clock, TrendingUp, Wallet } from 'lucide-react';
import { dashboardService, PaymentRecord, PaymentStats } from '@/app/features/Admin/Dashboard/api/dashboardService';
import { TimeRange } from '@/app/features/car-listing/types';

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtKES = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n);

const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Completed' },
  PENDING:   { bg: 'bg-amber-50',   text: 'text-amber-700',   label: 'Pending'   },
  FAILED:    { bg: 'bg-red-50',     text: 'text-red-700',     label: 'Failed'    },
  CANCELLED: { bg: 'bg-gray-50',    text: 'text-gray-600',    label: 'Cancelled' },
};

const STATUS_TABS = ['all', 'COMPLETED', 'PENDING', 'FAILED', 'CANCELLED'];

interface PaymentsContentProps {
  revenueSummary?: {
    total: number;
    previousTotal: number;
    change: string;
    count: number;
  } | null;
  timeRange?: TimeRange;
  setTimeRange?: (range: TimeRange) => void;
}

export default function PaymentsContent({ revenueSummary, timeRange = 'month', setTimeRange }: PaymentsContentProps) {
  const [payments, setPayments]           = useState<PaymentRecord[]>([]);
  const [loading, setLoading]             = useState(true);
  const [statsLoading, setStatsLoading]   = useState(true);
  const [stats, setStats]                 = useState<PaymentStats | null>(null);
  const [error, setError]                 = useState<string | null>(null);
  const [statusFilter, setStatusFilter]   = useState('all');
  const [search, setSearch]               = useState('');
  const [pagination, setPagination]       = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    COMPLETED: 0,
    PENDING: 0,
    FAILED: 0,
    CANCELLED: 0
  });

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true); 
      setError(null);
      
      const statusParam = statusFilter === 'all' ? '' : statusFilter;
      
      const res = await dashboardService.getAllPayments(pagination.page, pagination.limit, {
        status: statusParam, 
        search, 
        startDate: '', 
        endDate: '',
      });
      
      if (res.success) {
        setPayments(res.data);
        setPagination(prev => ({ 
          ...prev, 
          total: res.meta.total, 
          totalPages: res.meta.totalPages ?? Math.ceil(res.meta.total / prev.limit) 
        }));
        
        setStatusCounts(prev => ({
          ...prev,
          all: res.meta.total,
          [statusFilter]: res.meta.total
        }));
        
      } else {
        throw new Error('Failed to load payments');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Could not load payments.');
      setPayments([]);
    } finally { 
      setLoading(false); 
    }
  }, [pagination.page, pagination.limit, statusFilter, search]);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await dashboardService.getPaymentStats(timeRange);
      setStats(data);
      
      if (data?.statusDistribution) {
        const counts: Record<string, number> = {
          all: data.totalTransactions || 0,
          COMPLETED: 0,
          PENDING: 0,
          FAILED: 0,
          CANCELLED: 0
        };
        
        data.statusDistribution.forEach(item => {
          counts[item.status] = item.count;
        });
        
        setStatusCounts(counts);
      }
      
    } catch (error) {
      console.error('Stats error:', error);
      setStats({
        totalRevenue: 0, 
        pendingPayments: 0, 
        thisMonthRevenue: 0,
        avgTransactionValue: 0, 
        totalTransactions: 0,
        paymentMethods: [], 
        statusDistribution: [],
      });
    } finally { setStatsLoading(false); }
  }, [timeRange]);

  useEffect(() => { 
    fetchPayments(); 
    fetchStats(); 
  }, [fetchPayments, fetchStats]);

  const handleView = async (id: number) => {
    try {
      const res = await dashboardService.getPaymentDetails(id);
      if (res.success) alert(`Customer: ${res.data.customer.name}\nAmount: ${fmtKES(res.data.amount)}\nStatus: ${res.data.status}`);
    } catch { alert('Could not load details.'); }
  };

  const handleRefund = async (id: number, amount: number) => {
    if (!confirm(`Process refund of ${fmtKES(amount)}?`)) return;
    try {
      const res = await dashboardService.processRefund(id, amount, 'Customer request');
      if (res.success) { alert('Refund processed.'); fetchPayments(); fetchStats(); }
      else alert(`Failed: ${res.error}`);
    } catch { alert('Could not process refund.'); }
  };

  const handleRetry = async (id: number) => {
    if (!confirm('Retry this payment?')) return;
    try { await new Promise(r => setTimeout(r, 800)); alert('Retry initiated.'); fetchPayments(); }
    catch { alert('Could not retry.'); }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const tabCount = (s: string) => statusCounts[s] || 0;

  const paymentMethods = stats?.paymentMethods ?? [];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Payments</h1>
          <p className="text-xs text-gray-400 mt-0.5">Track and manage all transactions</p>
        </div>
        <div className="flex gap-2">
          {setTimeRange && (
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          )}
          <button
            onClick={() => { fetchPayments(); fetchStats(); }}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => alert('Exporting…')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards - Kenyan Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Revenue */}
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Total Revenue</span>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <div className="text-xl font-semibold text-gray-900">
            {statsLoading ? '—' : fmtKES(stats?.totalRevenue ?? 0)}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">All completed payments</p>
        </div>

        {/* Pending Amount */}
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Pending</span>
            <Clock size={14} className="text-amber-500" />
          </div>
          <div className="text-xl font-semibold text-amber-600">
            {statsLoading ? '—' : fmtKES(stats?.pendingPayments ?? 0)}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Awaiting confirmation</p>
        </div>

        {/* This Month */}
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">This Month</span>
            <Wallet size={14} className="text-blue-500" />
          </div>
          <div className="text-xl font-semibold text-gray-900">
            {statsLoading ? '—' : fmtKES(stats?.thisMonthRevenue ?? 0)}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {new Date().toLocaleString('default', { month: 'long' })} revenue
          </p>
        </div>

        {/* Avg Transaction */}
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Average Transaction</span>
            <CreditCard size={14} className="text-gray-400" />
          </div>
          <div className="text-xl font-semibold text-gray-900">
            {statsLoading ? '—' : fmtKES(stats?.avgTransactionValue ?? 0)}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Per completed payment</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-between px-3 py-2 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
          <span className="text-xs">{error}</span>
          <button onClick={fetchPayments} className="text-xs underline">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-4 flex-col lg:flex-row">

        {/* Table Section */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-3 py-2 border-b border-gray-100">
            <div className="flex gap-1 flex-wrap">
              {STATUS_TABS.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === s 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {s === 'all' ? 'All' : STATUS_STYLES[s]?.label ?? s}
                  <span className="ml-1 text-[10px] opacity-60">{tabCount(s)}</span>
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setPagination(prev => ({ ...prev, page: 1 }));
                    fetchPayments();
                  }
                }}
                placeholder="Search by customer or invoice"
                className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md text-xs bg-white text-gray-600 outline-none focus:border-gray-300 w-48"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-5 h-5 border border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-400">Loading payments...</p>
            </div>

          ) : payments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xs text-gray-400 mb-2">No payments found</p>
              {(statusFilter !== 'all' || search) && (
                <button
                  onClick={() => { handleStatusChange('all'); setSearch(''); }}
                  className="text-xs text-gray-500 underline"
                >
                  Clear filters
                </button>
              )}
            </div>

          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-3 py-2 text-left font-medium text-gray-500">ID</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Customer</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Invoice</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-500">Amount</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Method</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Status</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => {
                      const st = STATUS_STYLES[p.status] ?? STATUS_STYLES.CANCELLED;
                      return (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-2.5 font-mono text-gray-400">{p.paymentId}</td>
                          <td className="px-3 py-2.5">
                            <div className="font-medium text-gray-800">{p.customer}</div>
                            <div className="text-[10px] text-gray-400">{p.customerEmail}</div>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-gray-400">{p.invoice}</td>
                          <td className="px-3 py-2.5 text-right font-mono font-medium text-gray-900">{fmtKES(p.amount)}</td>
                          <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{fmtDate(p.date)}</td>
                          <td className="px-3 py-2.5">
                            <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                              {p.method}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${st.bg} ${st.text}`}>
                              {st.label}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleView(p.id)} className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
                                <Eye size={12} />
                              </button>
                              <button onClick={() => alert(`Invoice: ${p.invoice}`)} className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
                                <FileText size={12} />
                              </button>
                              {p.status === 'FAILED' && (
                                <button onClick={() => handleRetry(p.id)} className="p-1 hover:bg-gray-100 rounded text-emerald-500 transition-colors">
                                  <RefreshCw size={12} />
                                </button>
                              )}
                              {p.status === 'COMPLETED' && (
                                <button onClick={() => handleRefund(p.id, p.amount)} className="px-1.5 py-0.5 hover:bg-red-50 rounded text-red-500 text-[10px] transition-colors">
                                  Refund
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 text-xs text-gray-400">
                  <span>
                    {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                      disabled={pagination.page === 1}
                      className="px-2.5 py-1 border border-gray-200 rounded-md text-xs hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-2 py-1 text-gray-500 text-xs">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPagination(p => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-2.5 py-1 border border-gray-200 rounded-md text-xs hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-3 shrink-0">

          {/* Payment Methods */}
          {paymentMethods.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-xs font-medium text-gray-700 mb-2">Payment Methods</h3>
              <div className="space-y-2">
                {paymentMethods.map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-gray-600">{m.method}</span>
                      <span className="text-gray-400">{m.count} · {m.percentage}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: m.percentage }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Quick Actions</h3>
            <div className="space-y-1">
              {[
                { label: 'Process refund', icon: <CreditCard size={11} />, fn: () => alert('Open refund dialog') },
                { label: 'Generate report', icon: <FileText size={11} />, fn: () => alert('Generate report') },
                { label: 'Outstanding invoices', icon: <AlertCircle size={11} />, fn: () => alert('View outstanding') },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={a.fn}
                  className="w-full flex items-center gap-2 px-2 py-1.5 border border-gray-200 rounded-md text-[11px] text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-400">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Distribution */}
          {stats?.statusDistribution && stats.statusDistribution.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-xs font-medium text-gray-700 mb-2">By Status</h3>
              <div className="space-y-1.5">
                {stats.statusDistribution.map((item, i) => {
                  const st = STATUS_STYLES[item.status] ?? STATUS_STYLES.CANCELLED;
                  return (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${st.text === 'text-emerald-700' ? 'bg-emerald-400' : 
                          st.text === 'text-amber-700' ? 'bg-amber-400' : 
                          st.text === 'text-red-700' ? 'bg-red-400' : 'bg-gray-400'}`} />
                        <span className="text-gray-600">{st.label}</span>
                      </div>
                      <span className="text-gray-400 text-[10px]">{item.count} · {item.percentage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}