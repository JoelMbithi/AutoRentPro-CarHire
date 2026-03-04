"use client"
import React, { useState, useEffect } from 'react';
import {
  Download, ChevronRight, Eye, Car, MapPin, Plus,
  ArrowUpRight, ArrowDownRight, Users, CreditCard, Calendar
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

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
  active:    { dot: 'bg-emerald-400', text: 'text-emerald-700' },
  completed: { dot: 'bg-blue-400',    text: 'text-blue-700'    },
  pending:   { dot: 'bg-amber-400',   text: 'text-amber-700'   },
  available: { dot: 'bg-emerald-400', text: 'text-emerald-700' },
  rented:    { dot: 'bg-blue-400',    text: 'text-blue-700'    },
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

  // Fetch total revenue from completed payments
  const fetchTotalRevenue = async () => {
    try {
      setLoadingRevenue(true);
      const result = await fetch(`/features/Admin/Dashboard/api/dashboard/payments?timeRange=${timeRange}&status=COMPLETED`);
      const data = await result.json();

      if (data.success) {
        const revenue = data.data.reduce((sum: number, payment: any) => sum + payment.amount, 0);
        setLocalTotalRevenue(revenue);
      }
    } catch (error) {
      console.log('Error fetching revenue:', error);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Get total members
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

  // Get total cars
  const fetchTotalCars = async () => {
    setLoadingCars(true);
    try {
      const result = await fetch(`/features/Admin/Dashboard/api/dashboard/stats?timeRange=${timeRange}`);
      const data = await result.json();

      if (data) {
        const totalCars = data.totalCars || data.data?.totalCars || data.meta?.total || 0;
        setTotalCars(totalCars);
      } else {
        const fleetResult = await fetch(`/features/Admin/Dashboard/api/dashboard/fleet`);
        const fleetData = await fleetResult.json();
        
        if (fleetData.success) {
          const totalCars = fleetData.meta?.total || fleetData.data?.length || 0;
          setTotalCars(totalCars);
        }
      }
    } catch (error) {
      console.log("Error when fetching cars:", error);
      setTotalCars(fleetVehicles.length);
    } finally {
      setLoadingCars(false);
    }
  };

  // Get all completed bookings - FIXED VERSION
  const fetchCompletedBookings = async () => {
    setLoadingCompletedBookings(true);
    try {
      const result = await fetch(`/features/Admin/Dashboard/api/dashboard/bookings?status=COMPLETED&timeRange=${timeRange}&limit=1000`);
      const data = await result.json();

      console.log('Completed bookings response:', data); // Debug log

      // Handle different response formats
      if (Array.isArray(data)) {
        // Direct array response (like your API returns)
        const completedCount = data.filter((booking: any) => 
          booking.status === 'COMPLETED' || booking.uiStatus === 'completed'
        ).length;
        setTotalCompletedBookings(completedCount);
      } 
      else if (data.success && Array.isArray(data.data)) {
        // Wrapped in success/data
        const completedCount = data.data.filter((booking: any) => 
          booking.status === 'COMPLETED' || booking.uiStatus === 'completed'
        ).length;
        setTotalCompletedBookings(completedCount);
      } 
      else if (data.meta?.total) {
        // Has meta.total
        setTotalCompletedBookings(data.meta.total);
      } 
      else {
        console.log('Unexpected response format:', data);
        // Fallback: count from recentBookings prop
        const completedFromProps = recentBookings.filter(b => 
          b.status === 'completed' || b.status === 'COMPLETED'
        ).length;
        setTotalCompletedBookings(completedFromProps);
      }
    } catch (error) {
      console.log('Error when getting Completed booking', error);
      // Fallback: count from recentBookings prop
      const completedFromProps = recentBookings.filter(b => 
        b.status === 'completed' || b.status === 'COMPLETED'
      ).length;
      setTotalCompletedBookings(completedFromProps);
    } finally {
      setLoadingCompletedBookings(false);
    }
  };

  // Fetch all data when timeRange changes
  useEffect(() => {
    fetchTotalRevenue();
    fetchTotalMembers();
    fetchTotalCars();
    fetchCompletedBookings();
  }, [timeRange]);

  // Also update totalCars when fleetVehicles prop changes
  useEffect(() => {
    if (fleetVehicles.length > 0 && totalCars === 0) {
      setTotalCars(fleetVehicles.length);
    }
  }, [fleetVehicles]);

  const filteredBookings = selectedFilter === 'all'
    ? recentBookings
    : recentBookings.filter(b => b.status === selectedFilter);

  // Use local revenue if available, otherwise use prop
  const displayRevenue = localTotalRevenue > 0 ? localTotalRevenue : propTotalRevenue;

  // Enhanced quick stats with real data
  const quickStats = [
    { 
      label: 'Total Revenue', 
      value: loadingRevenue ? 'KSH ...' : `KSH ${displayRevenue.toLocaleString()}`,
      icon: <CreditCard size={14} className="text-emerald-500" />,
      change: extraStats.thisMonthRevenue ? `+${((extraStats.thisMonthRevenue / (displayRevenue || 1)) * 100).toFixed(1)}% this month` : ''
    },
    { 
      label: 'Total Members', 
      value: loadingMembers ? '...' : totalMembers.toLocaleString(),
      icon: <Users size={14} className="text-blue-500" />,
      change: `${extraStats.activeBookings || 0} active bookings`
    },
    { 
      label: 'Total Cars', 
      value: loadingCars ? '...' : totalCars.toLocaleString(),
      icon: <Car size={14} className="text-purple-500" />,
      change: `${extraStats.availableCars || 0} available, ${extraStats.rentedCars || 0} rented`
    },
    { 
      label: 'Completed Bookings', 
      value: loadingCompletedBookings ? "..." : totalCompletedBookings.toLocaleString(),
      icon: <Calendar size={14} className="text-amber-500" />,
      change: `${extraStats.pendingBookings || 0} pending bookings`
    },
  ];

  const runExport = async (fn: () => void) => {
    setExporting(true);
    try { fn(); } catch (e) { console.error(e); }
    finally { setExporting(false); setShowExportMenu(false); }
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Welcome back · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* time range */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {(['day', 'week', 'month', 'year'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors capitalize ${
                  timeRange === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(v => !v)}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Download size={13} /> {exporting ? 'Exporting…' : 'Export'}
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-md py-1 z-50">
                  {[
                    { label: 'Full report',  fn: () => exportFullDashboardReport(stats, recentBookings, fleetVehicles, timeRange) },
                    { label: 'Excel',        fn: () => exportToExcel(`dashboard_${timeRange}_${new Date().toISOString().split('T')[0]}.xls`, [...stats.map(s => ({ Type: 'Stat', ...s })), ...recentBookings.map(b => ({ Type: 'Booking', ...b })), ...fleetVehicles.map(v => ({ Type: 'Vehicle', ...v }))]) },
                  ].map(item => (
                    <button key={item.label} onClick={() => runExport(item.fn)} className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">{item.label}</button>
                  ))}
                  <div className="border-t border-gray-100 my-1" />
                  {[
                    { label: 'Bookings',   fn: () => exportBookingsToCSV(recentBookings) },
                    { label: 'Fleet',      fn: () => exportFleetToCSV(fleetVehicles) },
                    { label: 'Statistics', fn: () => exportStatsToCSV(stats) },
                  ].map(item => (
                    <button key={item.label} onClick={() => runExport(item.fn)} className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">{item.label}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* quick stats — enhanced with icons and real data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-gray-400">{s.label}</div>
              <div className="p-1 bg-gray-50 rounded-md">{s.icon}</div>
            </div>
            <div className="text-xl font-bold text-gray-900">{s.value}</div>
            {s.change && (
              <div className="text-xs text-gray-400 mt-1 truncate">{s.change}</div>
            )}
          </div>
        ))}
      </div>

      {/* main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* bookings table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Recent bookings</h2>
            <div className="flex gap-1">
              {(['all', 'active', 'pending', 'completed'] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium capitalize transition-colors ${
                    selectedFilter === f ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
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
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.slice(0, 5).map(b => {
                  const st = STATUS_STYLES[b.status] ?? STATUS_STYLES.pending;
                  return (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">#{b.id}</div>
                        <div className="text-xs text-gray-400">{b.date}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800">{b.customer}</div>
                        <div className="text-xs text-gray-400">{b.customerType}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800">{b.car}</div>
                        <div className="text-xs text-gray-400">{b.duration}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          <span className={`text-xs font-medium capitalize ${st.text}`}>{b.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors">
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100">
            <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors">
              View all <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* fleet status */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Fleet status</h2>
          <div className="space-y-2">
            {fleetVehicles.slice(0, 5).map((car, i) => {
              const st = STATUS_STYLES[car.status] ?? STATUS_STYLES.pending;
              return (
                <div key={i} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Car size={13} className="text-gray-400 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">{car.name}</div>
                        <div className="text-xs font-mono text-gray-400">{car.plate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      <span className={`text-xs font-medium capitalize ${st.text}`}>{car.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {car.location}</span>
                    <span>{car.fuel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
            <Plus size={13} /> Add vehicle
          </button>
        </div>
      </div>

      {/* Summary row - Additional stats */}
      {(extraStats.activeBookings !== undefined || extraStats.pendingBookings !== undefined) && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400">Active Bookings</p>
              <p className="text-lg font-semibold text-gray-900">{extraStats.activeBookings || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Pending Bookings</p>
              <p className="text-lg font-semibold text-amber-600">{extraStats.pendingBookings || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Available Cars</p>
              <p className="text-lg font-semibold text-emerald-600">{extraStats.availableCars || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Rented Cars</p>
              <p className="text-lg font-semibold text-blue-600">{extraStats.rentedCars || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;