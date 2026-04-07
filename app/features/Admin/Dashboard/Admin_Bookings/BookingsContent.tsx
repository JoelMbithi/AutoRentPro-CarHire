import React, { useState } from 'react';
import { Plus, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Booking } from '@/app/features/car-listing/types';

interface BookingsContentProps {
  recentBookings: Booking[];
}

const statusConfig = {
  active:    { label: 'Active',    dot: '#22c55e', bg: '#f0fdf4', text: '#16a34a' },
  completed: { label: 'Completed', dot: '#3b82f6', bg: '#eff6ff', text: '#2563eb' },
  upcoming:  { label: 'Upcoming',  dot: '#f59e0b', bg: '#fffbeb', text: '#d97706' },
  cancelled: { label: 'Cancelled', dot: '#ef4444', bg: '#fef2f2', text: '#dc2626' },
  rejected:  { label: 'Rejected',  dot: '#7f1d1d', bg: '#fee2e2', text: '#991b1b' },
};

const BookingsContent: React.FC<BookingsContentProps> = ({ recentBookings }) => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? recentBookings
    : recentBookings.filter(b => b.status === filter);

  const counts = {
    all: recentBookings.length,
    active: recentBookings.filter(b => b.status === 'active').length,
    upcoming: recentBookings.filter(b => b.status === 'upcoming').length,
    completed: recentBookings.filter(b => b.status === 'completed').length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .bk-wrap * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .bk-table { width: 100%; border-collapse: collapse; }
        .bk-table th { font-size: 11.5px; font-weight: 600; letter-spacing: 0.06em; color: #aaa; text-transform: uppercase; padding: 10px 16px; text-align: left; border-bottom: 1.5px solid #f0f0f0; }
        .bk-table td { padding: 14px 16px; border-bottom: 1px solid #f7f7f7; vertical-align: middle; }
        .bk-table tr:last-child td { border-bottom: none; }
        .bk-table tr:hover td { background: #fafafa; }
        .status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 99px; font-size: 11.5px; font-weight: 500; }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .filter-tab { padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
        .filter-tab.active { background: #111; color: #fff; }
        .filter-tab:not(.active) { background: transparent; color: #999; }
        .filter-tab:not(.active):hover { background: #f5f5f5; color: #555; }
        .btn-add { padding: 9px 18px; background: #111; color: #fff; border: none; border-radius: 10px; font-size: 13.5px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: background 0.15s; font-family: 'DM Sans', sans-serif; }
        .btn-add:hover { background: #333; }
        .icon-btn { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; border: none; background: transparent; cursor: pointer; transition: background 0.15s; }
        .icon-btn:hover { background: #f0f0f0; }
        .booking-id { font-family: 'DM Mono', monospace; font-size: 12px; color: #aaa; }
        .customer-name { font-size: 14px; font-weight: 500; color: #111; }
        .customer-type { font-size: 11.5px; color: #bbb; margin-top: 1px; }
        .car-name { font-size: 13.5px; color: #444; }
        .date-main { font-size: 13.5px; color: #333; }
        .date-sub { font-size: 12px; color: #bbb; margin-top: 1px; }
        .amount { font-family: 'DM Mono', monospace; font-size: 14px; color: #111; font-weight: 500; }
        .empty-state { text-align: center; padding: 60px 20px; color: #ccc; }
      `}</style>

      <div className="bk-wrap">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111', margin: 0 }}>Bookings</h1>
          <p style={{ fontSize: 14, color: '#999', marginTop: 4 }}>Track rentals and reservations</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: '1.5px solid #f0f0f0', borderRadius: 16, overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #f5f5f5', flexWrap: 'wrap', gap: 12 }}>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {(['all', 'active', 'upcoming', 'completed', 'cancelled'] as const).map(tab => (
                <button
                  key={tab}
                  className={`filter-tab ${filter === tab ? 'active' : ''}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.6 }}>
                    {counts[tab as keyof typeof counts]}
                  </span>
                </button>
              ))}
            </div>

            {/* <button className="btn-add">
              <Plus size={15} />
              New booking
            </button> */}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <p style={{ fontSize: 14 }}>No bookings found</p>
              </div>
            ) : (
              <table className="bk-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(booking => {
                    const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.upcoming;
                    return (
                      <tr key={booking.id}>
                        <td><span className="booking-id">{booking.id}</span></td>
                        <td>
                          <div className="customer-name">{booking.customer}</div>
                          {booking.customerType && <div className="customer-type">{booking.customerType}</div>}
                        </td>
                        <td><span className="car-name">{booking.car}</span></td>
                        <td>
                          <div className="date-main">{booking.date}</div>
                          <div className="date-sub">→ {booking.returnDate}</div>
                        </td>
                        <td><span className="amount">{booking.amount}</span></td>
                        <td>
                          <span className="status-pill" style={{ background: status.bg, color: status.text }}>
                            <span className="status-dot" style={{ background: status.dot }} />
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <button className="icon-btn" title="View">
                              <Eye size={15} color="#888" />
                            </button>
                            <button className="icon-btn" title="Edit">
                              <Edit size={15} color="#3b82f6" />
                            </button>
                            {booking.status === 'active' && (
                              <button className="icon-btn" title="Complete">
                                <CheckCircle size={15} color="#22c55e" />
                              </button>
                            )}
                            {(booking.status === 'upcoming' || booking.status === 'pending') && (
                              <>
                                <button className="icon-btn" title="Reject">
                                  <XCircle size={15} color="#dc2626" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer count */}
          {filtered.length > 0 && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f5f5f5', fontSize: 12, color: '#ccc' }}>
              Showing {filtered.length} of {recentBookings.length} bookings
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingsContent;