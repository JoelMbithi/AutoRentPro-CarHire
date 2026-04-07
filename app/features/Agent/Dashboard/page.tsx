"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Plus, Calendar, DollarSign, Settings, Menu } from 'lucide-react';
import BookingsSection from './components/BookingsSection';
import EarningsSection from './components/EarningSection';
import SettingsSection from './components/SettingSection';

import FleetSection from './components/FleetSection';
import Sidebar from './components/Sidebar';
import AddVehicle from './PopUps/AddVehicle';


const page = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('fleet');
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [earnings, setEarnings] = useState({ total: 0, monthly: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  // Check if user is AGENT and verified
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/features/auth/api/signin", {
          method: "GET",
          credentials: "include",
        });
        
        const data = await response.json();
        
        if (data.authenticated && data.user?.role === "AGENT") {
          if (!data.user.isVerified) {
            router.replace('/verification-pending');
            return;
          }
          setUser(data.user);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.replace('/auth/signin');
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthorized(false);
        router.replace('/auth/signin');
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchVehicles(),
        fetchBookings(),
        fetchEarnings()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/features/Agent/api/agent/vehicles", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("/features/Agent/api/agent/bookings", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await fetch("/features/Agent/api/agent/earnings", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setEarnings(data.earnings);
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [isAuthorized]);

  const handleVehicleSaved = () => {
    fetchVehicles();
    setShowAddModal(false);
    setEditingVehicle(null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/signin');
  };

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const navItems = [
    { id: 'fleet', icon: Car, label: 'My Fleet', count: vehicles.length },
    { id: 'bookings', icon: Calendar, label: 'Bookings', count: bookings.length },
    { id: 'earnings', icon: DollarSign, label: 'Earnings', count: null },
    { id: 'settings', icon: Settings, label: 'Settings', count: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navItems={navItems}
        user={user}
        onLogout={handleLogout}
      />

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        >
          <Menu size={20} />
        </button>
      )}

      <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === 'fleet' && 'My Fleet'}
              {activeTab === 'bookings' && 'Bookings & Rentals'}
              {activeTab === 'earnings' && 'Earnings'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'fleet' && (
            <FleetSection 
              vehicles={vehicles}
              onAddClick={() => {
                setEditingVehicle(null);
                setShowAddModal(true);
              }}
              onEdit={(vehicle) => {
                setEditingVehicle(vehicle);
                setShowAddModal(true);
              }}
              onRefresh={fetchVehicles}
            />
          )}
          {activeTab === 'bookings' && <BookingsSection bookings={bookings} />}
          {activeTab === 'earnings' && <EarningsSection earnings={earnings} bookings={bookings} />}
          {activeTab === 'settings' && <SettingsSection user={user} />}
        </main>
      </div>

      <AddVehicle
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingVehicle(null);
        }}
        onSave={handleVehicleSaved}
        vehicle={editingVehicle}
        isEditing={!!editingVehicle}
      />
    </div>
  );
};

export default page;