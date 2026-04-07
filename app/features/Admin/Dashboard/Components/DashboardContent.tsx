"use client"
import React, { useState, useEffect } from 'react';
import {
  Download, ChevronRight, Eye, Car, MapPin, Plus,
  Users, CreditCard, Calendar, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { StatItem, Booking, FleetVehicle, TimeRange, FilterType } from '@/app/features/car-listing/types';
import {
  exportBookingsToCSV,
  exportFleetToCSV,
  exportStatsToCSV,
  exportFullDashboardReport,
  exportToExcel
} from '@/app/features/Admin/utils/export';

interface DashboardContentProps {
  stats: StatItem[];
  recentBookings: Booking[];
  fleetVehicles: FleetVehicle[];
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  totalRevenue?: number;
  totalMembers?: number;
  totalCars?: number;
  extraStats?: {
    activeBookings?: number;
    pendingBookings?: number;
    availableCars?: number;
    rentedCars?: number;
    thisMonthRevenue?: number;
    averageRating?: number;
  };
}


const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  active:    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
    confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  completed: { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400'    },
  pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  available: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  rented:    { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400'    },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

// Payment Approval Modal
const PaymentApprovalModal = ({ 
  payment, 
  onClose, 
  onApprove, 
  onReject,
  approving 
}: { 
  payment: any; 
  onClose: () => void; 
  onApprove: (id: number) => void; 
  onReject: (id: number) => void;
  approving: boolean;
}) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-full">
            <Clock size={20} className="text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Review Payment</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Transaction ID:</span>
            <span className="font-mono text-sm">{payment.transactionId}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Customer:</span>
            <span className="font-medium">{payment.customer}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Email:</span>
            <span>{payment.customerEmail}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Phone:</span>
            <span>{payment.customerPhone}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Vehicle:</span>
            <span>{payment.car}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Amount:</span>
            <span className="text-lg font-bold text-emerald-600">KSH {payment.amount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={approving}
            className="flex-1 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onReject(payment.id)}
            disabled={approving}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
          <button
            onClick={() => onApprove(payment.id)}
            disabled={approving}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {approving ? 'Processing...' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};


const DashboardContent: React.FC<DashboardContentProps> = ({
  stats, recentBookings, fleetVehicles,
  timeRange, setTimeRange, selectedFilter, setSelectedFilter,
  totalRevenue: propTotalRevenue = 0,
  extraStats = {}
}) => {
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [localTotalRevenue, setLocalTotalRevenue] = useState<number>(propTotalRevenue);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingCars, setLoadingCars] = useState(false);
  const [totalCars, setTotalCars] = useState<number>(0);
  const [loadingCompletedBookings, setLoadingCompletedBookings] = useState(false);
  const [totalCompletedBookings, setTotalCompletedBookings] = useState<number>(0);
  
  // Payment approval states
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [approving, setApproving] = useState(false);

  // Fetch pending payments
  const fetchPendingPayments = async () => {
    try {
      setLoadingPayments(true);
      const result = await fetch('/features/Admin/Dashboard/api/dashboard/payments?status=PENDING');
      const data = await result.json();
      if (data.success && Array.isArray(data.data)) {
        setPendingPayments(data.data);
      }
    } catch (error) {
      console.log('Error fetching pending payments:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Approve payment
  const handleApprovePayment = async (paymentId: number) => {
    setApproving(true);
    try {
      const response = await fetch('/features/Admin/Dashboard/Admin_Dashboard/api/dashboard/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status: 'COMPLETED' })
      });
      const data = await response.json();
      if (data.success) {
        await fetchPendingPayments();
        await fetchTotalRevenue();
        setSelectedPayment(null);
        alert('Payment approved successfully!');
      } else {
        alert(data.error || 'Failed to approve payment');
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Failed to approve payment');
    } finally {
      setApproving(false);
    }
  };

  // Reject payment
  const handleRejectPayment = async (paymentId: number) => {
    setApproving(true);
    try {
      const response = await fetch('/features/Admin/Dashboard/Admin_Dashboard/api/dashboard/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status: 'FAILED' })
      });
      const data = await response.json();
      if (data.success) {
        await fetchPendingPayments();
        setSelectedPayment(null);
        alert('Payment rejected');
      } else {
        alert(data.error || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Failed to reject payment');
    } finally {
      setApproving(false);
    }
  };

 
  const fetchTotalRevenue = async () => {
    try {
      setLoadingRevenue(true);
      // Fixed URL - removed double slash
      const result = await fetch(`/features/Admin/Dashboard/api/dashboard/payments?timeRange=${timeRange}&status=COMPLETED`);
      const data = await result.json();
      if (data.success) {
        const revenue = data.data?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0;
        setLocalTotalRevenue(revenue);
      }
    } catch (error) {
      console.log('Error fetching revenue:', error);
    } finally {
      setLoadingRevenue(false);
    }
  };

  const fetchTotalMembers = async () => {
    setLoadingMembers(true);
    try {
      const result = await fetch(`/features/Admin/Dashboard/api/dashboard/customers`);
      const data = await result.json();
      if (data.success) {
        const totalMembers = data.meta?.total || data.total || data.data?.length || 0;
        setTotalMembers(totalMembers);
      }
    } catch (error) {
      console.log('Error fetching members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchTotalCars = async () => {
    setLoadingCars(true);
    try {
      const result = await fetch(`/features/Admin/Dashboard/api/dashboard/stats?timeRange=${timeRange}`);
      const data = await result.json();
      if (data && data.totalCars) {
        setTotalCars(data.totalCars);
      } else {
        setTotalCars(fleetVehicles.length);
      }
    } catch (error) {
      console.log("Error when fetching cars:", error);
      setTotalCars(fleetVehicles.length);
    } finally {
      setLoadingCars(false);
    }
  };

  const fetchCompletedBookings = async () => {
    setLoadingCompletedBookings(true);
    try {
      const result = await fetch(`/features/Admin/Dashboard/api/dashboard/bookings?status=COMPLETED&timeRange=${timeRange}&limit=1000`);
      const data = await result.json();
      if (Array.isArray(data)) {
        setTotalCompletedBookings(data.length);
      } else if (data.success && Array.isArray(data.data)) {
        setTotalCompletedBookings(data.data.length);
      } else {
        setTotalCompletedBookings(recentBookings.filter(b => b.status === 'completed').length);
      }
    } catch (error) {
      console.log('Error when getting Completed booking', error);
      setTotalCompletedBookings(recentBookings.filter(b => b.status === 'completed').length);
    } finally {
      setLoadingCompletedBookings(false);
    }
  };

  useEffect(() => {
    fetchTotalRevenue();
    fetchTotalMembers();
    fetchTotalCars();
    fetchCompletedBookings();
    fetchPendingPayments();
  }, [timeRange]);

  useEffect(() => {
    if (fleetVehicles.length > 0 && totalCars === 0) {
      setTotalCars(fleetVehicles.length);
    }
  }, [fleetVehicles]);

  
  const filteredBookings = selectedFilter === 'all'
    ? recentBookings
    : recentBookings.filter(b => b.status === selectedFilter);

  const displayRevenue = localTotalRevenue > 0 ? localTotalRevenue : propTotalRevenue;

  const quickStats = [
    {
      label: 'Total Revenue',
      value: loadingRevenue ? '—' : `KSH ${displayRevenue.toLocaleString()}`,
      icon: <CreditCard size={13} />,
      iconBg: 'bg-emerald-50 text-emerald-600',
      sub: extraStats.thisMonthRevenue ? `+${((extraStats.thisMonthRevenue / (displayRevenue || 1)) * 100).toFixed(1)}% this month` : '',
    },
    {
      label: 'Total Members',
      value: loadingMembers ? '—' : totalMembers.toLocaleString(),
      icon: <Users size={13} />,
      iconBg: 'bg-blue-50 text-blue-600',
      sub: `${extraStats.activeBookings || 0} active bookings`,
    },
    {
      label: 'Total Cars',
      value: loadingCars ? '—' : totalCars.toLocaleString(),
      icon: <Car size={13} />,
      iconBg: 'bg-violet-50 text-violet-600',
      sub: `${extraStats.availableCars || 0} available · ${extraStats.rentedCars || 0} rented`,
    },
    {
      label: 'Completed Bookings',
      value: loadingCompletedBookings ? '—' : totalCompletedBookings.toLocaleString(),
      icon: <Calendar size={13} />,
      iconBg: 'bg-amber-50 text-amber-600',
      sub: `${extraStats.pendingBookings || 0} pending`,
    },
  ];

  const runExport = async (fn: () => void) => {
    setExporting(true);
    try { fn(); } catch (e) { console.error(e); }
    finally { setExporting(false); setShowExportMenu(false); }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  
  return (
    <div className="flex flex-col gap-5 p-1">

      {/* Payment Approval Modal */}
      <PaymentApprovalModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onApprove={handleApprovePayment}
        onReject={handleRejectPayment}
        approving={approving}
      />

      {/* Pending Payments Section  */}
      {pendingPayments.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100 bg-amber-50">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-600" />
              <h2 className="text-sm font-medium text-amber-800">Pending Approvals</h2>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs rounded-full">
                {pendingPayments.length}
              </span>
            </div>
            <button 
              onClick={fetchPendingPayments} 
              disabled={loadingPayments}
              className="text-xs text-amber-600 hover:text-amber-700 disabled:opacity-50"
            >
              {loadingPayments ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs text-gray-500">{payment.transactionId}</span>
                      <span className="text-sm font-medium text-gray-900">{payment.customer}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{payment.car}</span>
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                      <span className="font-medium text-emerald-600">KSH {payment.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-medium text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">{today}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {(['day', 'week', 'month', 'year'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs rounded-md capitalize transition-colors font-medium ${
                  timeRange === r
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(v => !v)}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-[7px] border border-gray-200 bg-white rounded-lg text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Download size={12} />
              {exporting ? 'Exporting…' : 'Export'}
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
                  {[
                    { label: 'Full report', fn: () => exportFullDashboardReport(stats, recentBookings, fleetVehicles, timeRange) },
                    { label: 'Excel', fn: () => exportToExcel(`dashboard_${timeRange}_${new Date().toISOString().split('T')[0]}.xls`, [...stats.map(s => ({ Type: 'Stat', ...s })), ...recentBookings.map(b => ({ Type: 'Booking', ...b })), ...fleetVehicles.map(v => ({ Type: 'Vehicle', ...v }))]) },
                  ].map(item => (
                    <button key={item.label} onClick={() => runExport(item.fn)} className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 my-1" />
                  {[
                    { label: 'Bookings CSV',   fn: () => exportBookingsToCSV(recentBookings) },
                    { label: 'Fleet CSV',      fn: () => exportFleetToCSV(fleetVehicles) },
                    { label: 'Statistics CSV', fn: () => exportStatsToCSV(stats) },
                  ].map(item => (
                    <button key={item.label} onClick={() => runExport(item.fn)} className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">{s.label}</span>
              <div className={`p-1.5 rounded-md ${s.iconBg}`}>{s.icon}</div>
            </div>
            <div className="text-[22px] font-semibold text-gray-900 tracking-tight leading-none mb-1.5">
              {s.value}
            </div>
            {s.sub && <p className="text-[11px] text-gray-400">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bookings table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-800">Recent bookings</h2>
            <div className="flex gap-1">
              {(['all', 'active', 'pending', 'completed'] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium capitalize transition-colors ${
                    selectedFilter === f
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Booking', 'Customer', 'Vehicle', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.slice(0, 5).map(b => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-medium text-gray-800">#{b.id}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{b.date}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[13px] text-gray-800">{b.customer}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{b.customerType}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[13px] text-gray-800">{b.car}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{b.duration}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors">
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-2.5 border-t border-gray-100">
            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              View all <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Fleet panel */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-800">Fleet status</h2>
          </div>

          <div className="p-3 flex flex-col gap-2">
            {fleetVehicles.slice(0, 5).map((car, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 rounded-md">
                      <Car size={11} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-gray-800 leading-tight">{car.name}</div>
                      <div className="text-[10px] font-mono text-gray-400 mt-0.5">{car.plate}</div>
                    </div>
                  </div>
                  <StatusBadge status={car.status} />
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-gray-50">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <MapPin size={9} /> {car.location}
                  </span>
                  <span className="text-[11px] text-gray-400">{car.fuel}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 pb-3">
            <button className="w-full py-2 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
              <Plus size={11} /> Add vehicle
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary row ── */}
      {(extraStats.activeBookings !== undefined || extraStats.pendingBookings !== undefined) && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-medium text-gray-800 mb-3">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-lg px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Active</p>
              <p className="text-[18px] font-semibold text-gray-900">{extraStats.activeBookings || 0}</p>
            </div>
            <div className="bg-amber-50 rounded-lg px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-widest text-amber-500 mb-1">Pending</p>
              <p className="text-[18px] font-semibold text-amber-700">{extraStats.pendingBookings || 0}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-widest text-emerald-500 mb-1">Available</p>
              <p className="text-[18px] font-semibold text-emerald-700">{extraStats.availableCars || 0}</p>
            </div>
            <div className="bg-blue-50 rounded-lg px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-widest text-blue-500 mb-1">Rented</p>
              <p className="text-[18px] font-semibold text-blue-700">{extraStats.rentedCars || 0}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardContent;