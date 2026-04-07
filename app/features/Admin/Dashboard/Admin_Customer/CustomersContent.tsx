"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';


import { CustomerToolbar } from './customers/CustomerToolbar';
import { CustomerTable } from './customers/CustomerTable';
import { RoleChangeModal } from './customers/RoleChangeModal';
import { TABS } from './customers/helpers';
import { Customer, dashboardService } from '../api/dashboardService';

export default function CustomersContent() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalCustomers: 0, activeCustomers: 0, vipMembers: 0, avgRating: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Role change modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; currentRole: string; newRole: string } | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);

 
 const fetchUsers = useCallback(async () => {
  try {
    setLoading(true); setError(null);
    
  
    let url = `/features/Admin/Dashboard/Admin_Customer/api/customers?page=1&limit=50`;
    
    //  search parameter
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    // For "all" tab, don't send role parameter (or send role=all)
    if (roleFilter !== 'all') {
      url += `&role=${roleFilter}`;
    }
    
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    
    if (data?.success && Array.isArray(data.data)) {
      setUsers(data.data.map((u: any) => ({
        id: u.id,
        customerId: `U${u.id.toString().padStart(3, '0')}`,
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        email: u.email || '',
        phone: u.phone || '—',
        role: u.role || 'CUSTOMER',
        status: u.isVerified ? 'active' : 'inactive',
        isVerified: u.isVerified || false,
        totalSpent: u.bookings?.reduce((s: number, b: any) => s + (b.totalPrice || 0), 0) || 0,
        bookings: u._count?.bookings || 0,
        joinedDate: u.createdAt || new Date(),
        lastBooking: u.bookings?.[0]?.createdAt || null,
      })));
    } else {
      setUsers([]);
    }
  } catch (err) {
    console.error('Error fetching users:', err);
    setError('Could not load users.');
    setUsers([]);
  } finally { 
    setLoading(false); 
  }
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

  useEffect(() => { fetchUsers(); fetchStats(); }, [fetchUsers, fetchStats]);


  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await dashboardService.deleteCustomer(parseInt(userId.replace('U', '')));
      fetchUsers();
      fetchStats();
    } catch { alert('Could not delete user.'); }
  };

  
const handleVerify = async (userId: number, isVerified: boolean) => {
  try {
    const response = await fetch('/features/Admin/Dashboard/Admin_Customer/api/customers/verify', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId, isVerified }),
    });
    
    const data = await response.json();
    if (data.success) {
      fetchUsers();
      fetchStats();
    } else {
      alert(data.error || 'Failed to update verification status');
    }
  } catch (error) {
    console.error('Error updating verification:', error);
    alert('Failed to update verification status');
  }
};


  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(true);
    try {
      const response = await fetch('/features/Admin/Dashboard/Admin_Customer/api/customers/update-role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          userId: parseInt(userId.replace('U', '')), 
          role: newRole 
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchStats();
        setShowRoleModal(false);
        setSelectedCustomer(null);
      } else {
        alert(data.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    } finally {
      setUpdatingRole(false);
    }
  };

  const openRoleModal = (user: Customer, newRole: string) => {
    setSelectedCustomer({
      id: user.customerId,
      name: user.name,
      currentRole: user.role,
      newRole: newRole,
    });
    setShowRoleModal(true);
  };

  // Filter users based on selected role filter
  const filteredUsers = roleFilter === 'all' 
    ? users 
    : users.filter(u => u.role === roleFilter);

  // Calculate tab counts from actual users data
  const tabCounts = TABS.reduce((acc, tab) => {
    if (tab.key === 'all') {
      acc[tab.key] = users.length;
    } else {
      acc[tab.key] = users.filter(u => u.role === tab.key).length;
    }
    return acc;
  }, {} as Record<string, number>);


  return (
    <div>
      {/* Role Change Modal */}
      {selectedCustomer && (
        <RoleChangeModal
          isOpen={showRoleModal}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedCustomer(null);
          }}
          onConfirm={() => handleRoleChange(selectedCustomer.id, selectedCustomer.newRole)}
          customerName={selectedCustomer.name}
          currentRole={selectedCustomer.currentRole}
          newRole={selectedCustomer.newRole}
          loading={updatingRole}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Users Management</h1>
        
      </div>

    
      {/* Error Alert */}
      {error && (
        <div className="flex items-center justify-between mb-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
          <button onClick={fetchUsers} className="underline text-xs ml-4">Retry</button>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <CustomerToolbar
          search={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          tabCounts={tabCounts}
          onRefresh={() => { fetchUsers(); fetchStats(); }}
          onAddCustomer={() => alert('Open add user form')}
          onExport={() => alert('Export functionality coming soon')}
          loading={loading}
        />

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-300">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto mb-3" />
            Loading users...
          </div>
        ) : (
          <CustomerTable
            customers={filteredUsers}
            onRoleChange={openRoleModal}
            onDelete={handleDelete}
            onView={(id) => router.push(`/dashboard/customers/${id}`)}
            onEdit={(user) => alert(`Edit: ${user.name}`)}
             onVerify={handleVerify}
          />
        )}

        {/* Footer */}
        {!loading && filteredUsers.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 flex justify-between text-xs text-gray-300">
            <span>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
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