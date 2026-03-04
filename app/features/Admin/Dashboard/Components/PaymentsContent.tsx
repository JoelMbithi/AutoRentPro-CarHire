"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Download, Eye, FileText, RefreshCw, Search, CreditCard, AlertCircle, DollarSign, Clock } from 'lucide-react';
import { dashboardService, PaymentRecord, PaymentStats } from '@/app/features/Admin/Dashboard/api/dashboardService';
import { TimeRange } from '@/app/features/car-listing/types';


// ── helpers ───────────────────────────────────────────────────────────────────
const fmtKES = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n);

const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
  COMPLETED: { dot: 'bg-emerald-400', text: 'text-emerald-700', label: 'Completed' },
  PENDING:   { dot: 'bg-amber-400',   text: 'text-amber-700',   label: 'Pending'   },
  FAILED:    { dot: 'bg-red-400',     text: 'text-red-700',     label: 'Failed'    },
  CANCELLED: { dot: 'bg-gray-300',    text: 'text-gray-500',    label: 'Cancelled' },
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

// ── component ─────────────────────────────────────────────────────────────────
export default function PaymentsContent({ revenueSummary, timeRange = 'month', setTimeRange }: PaymentsContentProps) {
  const [payments, setPayments]           = useState<PaymentRecord[]>([]);
  const [loading, setLoading]             = useState(true);
  const [statsLoading, setStatsLoading]   = useState(true);
  const [stats, setStats]                 = useState<PaymentStats | null>(null);
  const [error, setError]                 = useState<string | null>(null);
  const [statusFilter, setStatusFilter]   = useState('all');
  const [search, setSearch]               = useState('');
  const [pagination, setPagination]       = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Store total counts by status from the API response
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    COMPLETED: 0,
    PENDING: 0,
    FAILED: 0,
    CANCELLED: 0
  });

  // ── fetching ─────────────────────────────────────────────────────────────
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true); 
      setError(null);
      
      // Don't send status if it's 'all'
      const statusParam = statusFilter === 'all' ? '' : statusFilter;
      
      console.log('Fetching payments with:', {
        page: pagination.page,
        limit: pagination.limit,
        status: statusParam || 'all',
        search
      });
      
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
        
        // Update status counts based on the total from meta
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
      
      // Update status counts from stats data
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

  // ── actions ───────────────────────────────────────────────────────────────
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

  const tabCount = (s: string) => {
    return statusCounts[s] || 0;
  };

  const paymentMethods = stats?.paymentMethods ?? [];

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* header with revenue summary */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-400">
              Total Revenue: <span className="font-semibold text-emerald-600">
                {statsLoading ? '—' : fmtKES(stats?.totalRevenue ?? 0)}
              </span>
            </p>
            <span className="text-gray-300">•</span>
            <p className="text-sm text-gray-400">
              Transactions: <span className="font-semibold text-gray-700">
                {statsLoading ? '—' : stats?.totalTransactions ?? 0}
              </span>
            </p>
            <span className="text-gray-300">•</span>
            <p className="text-sm text-gray-400">
              Pending: <span className="font-semibold text-amber-600">
                {statsLoading ? '—' : fmtKES(stats?.pendingPayments ?? 0)}
              </span>
            </p>
          </div>
          {/* Show current filter */}
          {statusFilter !== 'all' && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600">
                Showing: {STATUS_STYLES[statusFilter]?.label || statusFilter} payments
                <button 
                  onClick={() => handleStatusChange('all')}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {/* Time range selector */}
          {setTimeRange && (
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => alert('Exporting…')}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* stat chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Total Revenue (Completed Only) */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <DollarSign size={16} />
            <div className="text-xs font-medium text-gray-400">TOTAL REVENUE</div>
          </div>
          <div className="text-xl font-bold text-gray-900 font-mono">
            {statsLoading ? '—' : fmtKES(stats?.totalRevenue ?? 0)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            From completed payments only
          </div>
        </div>

        {/* Pending Payments Amount */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Clock size={16} />
            <div className="text-xs font-medium text-gray-400">PENDING AMOUNT</div>
          </div>
          <div className="text-xl font-bold text-gray-900 font-mono">
            {statsLoading ? '—' : fmtKES(stats?.pendingPayments ?? 0)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Awaiting confirmation
          </div>
        </div>

        {/* This Month Revenue */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <CreditCard size={16} />
            <div className="text-xs font-medium text-gray-400">THIS MONTH</div>
          </div>
          <div className="text-xl font-bold text-gray-900 font-mono">
            {statsLoading ? '—' : fmtKES(stats?.thisMonthRevenue ?? 0)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Revenue in {new Date().toLocaleString('default', { month: 'long' })}
          </div>
        </div>

        {/* Average Transaction */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <FileText size={16} />
            <div className="text-xs font-medium text-gray-400">AVG TRANSACTION</div>
          </div>
          <div className="text-xl font-bold text-gray-900 font-mono">
            {statsLoading ? '—' : fmtKES(stats?.avgTransactionValue ?? 0)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Per completed payment
          </div>
        </div>
      </div>

    
      {/* error */}
      {error && (
        <div className="flex items-center justify-between mb-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
          <button onClick={fetchPayments} className="underline text-xs ml-4">Retry</button>
        </div>
      )}

      {/* main layout */}
      <div className="flex gap-5 flex-col lg:flex-row">

        {/* ── table card ── */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* toolbar */}
          <div className="flex items-center gap-2 flex-wrap px-4 py-3 border-b border-gray-100">
            {/* status tabs */}
            <div className="flex gap-1 flex-wrap flex-1">
              {STATUS_TABS.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === s ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {s === 'all' ? 'All' : STATUS_STYLES[s]?.label ?? s}
                  <span className="ml-1 text-xs opacity-50">{tabCount(s)}</span>
                </button>
              ))}
            </div>
            {/* search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setPagination(prev => ({ ...prev, page: 1 }));
                    fetchPayments();
                  }
                }}
                placeholder="Search…"
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none focus:border-gray-400 w-40"
              />
            </div>
          </div>

          {/* loading */}
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-300">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto mb-3" />
              Loading payments...
            </div>

          /* empty */
          ) : payments.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-300">
              No {statusFilter !== 'all' ? STATUS_STYLES[statusFilter]?.label.toLowerCase() : ''} payments found
              <br />
              <button
                onClick={() => { handleStatusChange('all'); setSearch(''); }}
                className="mt-3 px-4 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                Clear filters
              </button>
            </div>

          /* table */
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['ID', 'Customer', 'Invoice', 'Amount', 'Date', 'Method', 'Status', ''].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-300 whitespace-nowrap last:text-right">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => {
                      const st = STATUS_STYLES[p.status] ?? STATUS_STYLES.CANCELLED;
                      return (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">
                          <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.paymentId}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800 whitespace-nowrap">{p.customer}</div>
                            <div className="text-xs text-gray-300">{p.customerEmail}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.invoice}</td>
                          <td className="px-4 py-3 font-mono font-semibold text-gray-900 whitespace-nowrap">{fmtKES(p.amount)}</td>
                          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmtDate(p.date)}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{p.method}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleView(p.id)} title="View" className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors">
                                <Eye size={14} />
                              </button>
                              <button onClick={() => alert(`Invoice: ${p.invoice}`)} title="Invoice" className="p-1.5 rounded-md hover:bg-gray-100 text-blue-400 transition-colors">
                                <FileText size={14} />
                              </button>
                              {p.status === 'FAILED' && (
                                <button onClick={() => handleRetry(p.id)} title="Retry" className="p-1.5 rounded-md hover:bg-gray-100 text-emerald-500 transition-colors">
                                  <RefreshCw size={14} />
                                </button>
                              )}
                              {p.status === 'COMPLETED' && (
                                <button onClick={() => handleRefund(p.id, p.amount)} title="Refund" className="px-2 py-1 rounded-md hover:bg-red-50 text-red-400 text-xs font-medium transition-colors">
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

              {/* pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
                  <span>
                    {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                      disabled={pagination.page === 1}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1.5 text-gray-500">
                      {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPagination(p => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── sidebar ── */}
        <div className="w-full lg:w-72 space-y-4 shrink-0">

          {/* payment methods */}
          {paymentMethods.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Payment methods</h2>
              <div className="space-y-3">
                {paymentMethods.map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{m.method}</span>
                      <span className="text-gray-400">{m.count} · {m.percentage}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: m.percentage }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* quick actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Process refund',        icon: <CreditCard size={13} />, fn: () => alert('Open refund dialog') },
                { label: 'Generate report',        icon: <FileText size={13} />,   fn: () => alert('Generate report') },
                { label: 'Outstanding invoices',   icon: <AlertCircle size={13} />, fn: () => alert('View outstanding') },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={a.fn}
                  className="w-full flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-gray-400">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* status distribution */}
          {stats?.statusDistribution && stats.statusDistribution.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">By status</h2>
              <div className="space-y-2">
                {stats.statusDistribution.map((item, i) => {
                  const st = STATUS_STYLES[item.status] ?? STATUS_STYLES.CANCELLED;
                  return (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                        <span className="text-gray-500 text-xs">{st.label}</span>
                      </div>
                      <span className="text-xs text-gray-400">{item.count} · {item.percentage}%</span>
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