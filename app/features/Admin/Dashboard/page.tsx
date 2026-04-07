"use client"
import React, { useState, useEffect } from 'react';
import {
  Home, Car, CalendarDays, Users, CreditCard, FileBarChart,
  MessageSquare, Wrench, Settings, DollarSign, CarFront,
  AlertCircle, Star, Menu, Search, Bell, Plus, RefreshCw, ChevronDown, User, LogOut, Shield
} from 'lucide-react';
import Header from "./Components/Headers"
import Sidebar from './Components/Sidebar';
import DashboardContent from './Components/DashboardContent';
import FleetContent from './Admin_Fleet/FleetContent';
import BookingsContent from './Admin_Bookings/BookingsContent';
import CustomersContent from './Admin_Customer/CustomersContent';
import PaymentsContent from './Admin_Payment/PaymentsContent';
import { StatItem, Booking, FleetVehicle, NavItem, TimeRange, FilterType } from '../../car-listing/types';
import { dashboardService, type DashboardStats as ApiDashboardStats, type RecentBooking as ApiRecentBooking, type FleetVehicle as ApiFleetVehicle } from './api/dashboardService';

import ReportsContent from './Components/Admin_Report/ReportsContent';
import MessageContent from './Components/Admin_Message/MessageContent';
import { useRouter } from 'next/navigation';
import { paymentService, RevenueSummary } from './api/dashboard/payments/paymentService';
import AdminSettingsPage from './Adimn_Settings/AdminSetting';

const Dashboard = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<ApiDashboardStats | null>(null);
  const [apiBookings, setApiBookings] = useState<ApiRecentBooking[]>([]);
  const [apiFleet, setApiFleet] = useState<ApiFleetVehicle[]>([]);
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'profile' | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // ROLE-BASED ACCESS CONTROL - Check if user is ADMIN
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check auth status from API
        const response = await fetch("/features/auth/api/signin", {
          method: "GET",
          credentials: "include",
        });
        
        const data = await response.json();
        
        if (data.authenticated && data.user?.role === "ADMIN") {
          setUser(data.user);
          setIsAuthorized(true);
        } else {
          // Also check localStorage as fallback
          const userData = localStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role === "ADMIN") {
              setUser(parsedUser);
              setIsAuthorized(true);
            } else {
              setIsAuthorized(false);
              router.replace('/auth/signin');
            }
          } else {
            setIsAuthorized(false);
            router.replace('/auth/signin');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthorized(false);
        router.replace('/auth/signin');
      }
    };
    
    checkAuth();
  }, [router]);

  // Get user from localStorage on mount (fallback)
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && !user) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === "ADMIN") {
        setUser(parsedUser);
        setIsAuthorized(true);
      }
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.profile-dropdown')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch all data including revenue
  useEffect(() => {
    if (!isAuthorized) return; // Only fetch data if authorized
    
    const fetchData = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case 'dashboard': {
            const [s, b, f, r] = await Promise.all([
              dashboardService.getDashboardStats(timeRange),
              dashboardService.getRecentBookings(10),
              dashboardService.getFleetVehicles(),
              paymentService.getRevenueSummary(timeRange)
            ]);
            setApiStats(s);
            setApiBookings(b);
            setApiFleet(f);
            setRevenueSummary(r);
            break;
          }
          case 'fleet':
            setApiFleet(await dashboardService.getFleetVehicles());
            break;
          case 'bookings':
            setApiBookings(await dashboardService.getRecentBookings(50));
            break;
          case 'payments': {
            const r = await paymentService.getRevenueSummary(timeRange);
            setRevenueSummary(r);
            break;
          }
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, timeRange, isAuthorized]);

  // Show loading screen while checking auth
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // If not authorized, don't render anything 
  if (!isAuthorized) {
    return null;
  }

  // Create stats array with revenue from payment service
  const stats: StatItem[] = apiStats && revenueSummary ? [
    {
      title: 'Total Revenue',
      value: `KSH ${revenueSummary.total.toLocaleString()}`,
      change: revenueSummary.change,
      icon: DollarSign,
      color: 'bg-emerald-500',
      detail: 'Current period',
      trend: revenueSummary.change.includes('+') ? 'up' : 'down'
    },
    {
      title: 'Active Rentals',
      value: apiStats.activeBookings.toString(),
      change: apiStats.bookingChange || '+0%',
      icon: CarFront,
      color: 'bg-blue-500',
      detail: 'Currently on rent',
      trend: 'up' as const
    },
    {
      title: 'Pending Actions',
      value: apiStats.pendingBookings.toString(),
      change: '-5.1%',
      icon: AlertCircle,
      color: 'bg-amber-500',
      detail: 'Check-ins & approvals',
      trend: 'down' as const
    },
    {
      title: 'Customer Satisfaction',
      value: apiStats.customerSatisfaction.toFixed(1),
      change: '+0.3',
      icon: Star,
      color: 'bg-violet-500',
      detail: 'Avg. rating',
      trend: 'up' as const
    },
  ] : [];

  const recentBookings: Booking[] = apiBookings.map(b => ({
    id: b.id, customer: b.customer, customerType: b.customerType as any,
    car: b.car, date: b.date, returnDate: b.returnDate, duration: b.duration,
    amount: b.amount, status: b.status.toLowerCase() as any, payment: b.payment as any,
    priority: b.customerType === 'Premium' || b.customerType === 'Corporate' ? 'high' : 'normal',
  }));

  const fleetVehicles: FleetVehicle[] = apiFleet.map(v => ({
    id: v.id, name: v.name, plate: v.plate, status: v.status,
    rating: v.rating, price: v.price, type: v.type,
    year: v.year || '2024',
    make: v.make || v.name.split(' ')[0] || 'Unknown',
    model: v.model || v.name.split(' ').slice(1).join(' ') || 'Unknown',
    fuel: v.fuel, location: v.location, nextService: v.nextService, image: v.image,
    seats: v.seats ?? 4,
    currentRenter: v.currentRenter,
  }));

  const navItems: NavItem[] = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', count: null, badge: null },
    { id: 'fleet', icon: Car, label: 'Fleet', count: apiStats?.totalCars?.toString() || '28', badge: 'new' },
    { id: 'bookings', icon: CalendarDays, label: 'Bookings', count: ((apiStats?.activeBookings || 0) + (apiStats?.pendingBookings || 0)).toString(), badge: null },
    { id: 'customers', icon: Users, label: 'Customers', count: apiStats?.totalCustomers?.toLocaleString() || '1.2K', badge: null },
    { id: 'payments', icon: CreditCard, label: 'Payments', count: revenueSummary?.count?.toString() || apiStats?.totalTransactions?.toString() || '86', badge: null },
    { id: 'reports', icon: FileBarChart, label: 'Reports', count: null, badge: null },
    { id: 'messages', icon: MessageSquare, label: 'Messages', count: '12', badge: '3' },
    { id: 'maintenance', icon: Wrench, label: 'Maintenance', count: '5', badge: 'urgent' },
    { id: 'settings', icon: Settings, label: 'Settings', count: null, badge: null },
  ];

  const handleRefresh = async () => {
    if (activeTab !== 'dashboard') return;
    setLoading(true);
    try {
      const [s, b, f, r] = await Promise.all([
        dashboardService.getDashboardStats(timeRange),
        dashboardService.getRecentBookings(10),
        dashboardService.getFleetVehicles(),
        paymentService.getRevenueSummary(timeRange)
      ]);
      setApiStats(s);
      setApiBookings(b);
      setApiFleet(f);
      setRevenueSummary(r);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    // Clear cookies by calling logout endpoint
    await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/signin');
  };

  const renderContent = () => {
    if (loading && ['dashboard', 'fleet', 'bookings', 'payments'].includes(activeTab)) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        </div>
      );
    }
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent
          stats={stats}
          recentBookings={recentBookings}
          fleetVehicles={fleetVehicles}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />;
      case 'fleet':
        return <FleetContent fleetVehicles={fleetVehicles} />;
      case 'bookings':
        return <BookingsContent recentBookings={recentBookings} />;
      case 'customers':
        return <CustomersContent />;
      case 'payments':
        return <PaymentsContent revenueSummary={revenueSummary} timeRange={timeRange} setTimeRange={setTimeRange} />;
      case 'reports':
        return <ReportsContent />;
      case 'messages':
        return <MessageContent />;
      case 'maintenance':
        return <div className="p-8 text-center text-gray-400">Maintenance — coming soon</div>;
      case 'settings':
        return <AdminSettingsPage />;
      default:
        return <div className="p-8 text-center text-gray-400">Select a section from the sidebar</div>;
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (user) {
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    }
    return 'AD';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user) {
      return `${user.firstName || 'Admin'} ${user.lastName || ''}`.trim();
    }
    return 'Admin';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-5 py-3 flex items-center justify-between gap-4">

          {/* left — hamburger + wordmark */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu size={20} className="text-gray-600" />
            </button>
            <span className="text-base font-bold text-gray-900 tracking-tight">
              Auto<span className="text-red-500">Rent</span>Pro
            </span>
          </div>

          {/* centre — search */}
          <div className="relative hidden md:block flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search bookings, customers, vehicles…"
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* right — actions + user */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('bookings')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Plus size={13} /> New booking
            </button>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>

            {/* bell */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* user dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
                className="flex items-center gap-2 pl-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {getUserInitials()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-none">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {user?.role === 'ADMIN' ? 'Administrator' : user?.role || 'Admin'}
                  </p>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden lg:block" />
              </button>

              {/* Dropdown menu */}
              {openDropdown === 'profile' && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setOpenDropdown(null);
                      router.push('/features/Admin/Auth/profile');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={14} className="text-gray-400" />
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setOpenDropdown(null);
                      setActiveTab('settings');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={14} className="text-gray-400" />
                    Settings
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navItems={navItems}
        />
        <main className="flex-1 p-5 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;