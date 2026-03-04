// app/utils/export.ts
import { Booking, FleetVehicle, StatItem } from '@/app/features/car-listing/types';

// Export data to CSV format
export function exportToCSV(filename: string, data: any[], headers?: string[]) {
  const csvContent = convertToCSV(data, headers);
  downloadFile(filename, csvContent, 'text/csv');
}

// Export data to Excel format (using CSV as Excel can read it)
export function exportToExcel(filename: string, data: any[], headers?: string[]) {
  const csvContent = convertToCSV(data, headers);
  downloadFile(filename, csvContent, 'application/vnd.ms-excel');
}

// Convert data to CSV format
function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';
  
  const actualHeaders = headers || Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(actualHeaders.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = actualHeaders.map(header => {
      const value = row[header];
      // Handle special characters and quotes
      if (value === null || value === undefined) return '';
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

// Download file utility
function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Specific export functions for dashboard data
export function exportBookingsToCSV(bookings: Booking[]) {
  const data = bookings.map(booking => ({
    'Booking ID': booking.id,
    'Customer': booking.customer,
    'Customer Type': booking.customerType,
    'Vehicle': booking.car,
    'Start Date': booking.date,
    'End Date': booking.returnDate,
    'Duration': booking.duration,
    'Amount': booking.amount,
    'Status': booking.status,
    'Payment Status': booking.payment,
    'Priority': booking.priority || 'normal'
  }));
  
  exportToCSV(`bookings_${new Date().toISOString().split('T')[0]}.csv`, data);
}

export function exportFleetToCSV(fleet: FleetVehicle[]) {
  const data = fleet.map(vehicle => ({
    'Vehicle Name': vehicle.name,
    'License Plate': vehicle.plate,
    'Status': vehicle.status,
    'Rating': vehicle.rating,
    'Price': vehicle.price,
    'Type': vehicle.type,
    'Fuel Level': vehicle.fuel,
    'Location': vehicle.location,
    'Next Service': vehicle.nextService
  }));
  
  exportToCSV(`fleet_${new Date().toISOString().split('T')[0]}.csv`, data);
}

export function exportStatsToCSV(stats: StatItem[]) {
  const data = stats.map(stat => ({
    'Metric': stat.title,
    'Value': stat.value,
    'Change': stat.change,
    'Trend': stat.trend,
    'Details': stat.detail
  }));
  
  exportToCSV(`dashboard_stats_${new Date().toISOString().split('T')[0]}.csv`, data);
}

// Export all dashboard data
export function exportFullDashboardReport(
  stats: StatItem[], 
  bookings: Booking[], 
  fleet: FleetVehicle[],
  timeRange: string
) {
  const reportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      timeRange: timeRange,
      totalBookings: bookings.length,
      totalVehicles: fleet.length,
      availableVehicles: fleet.filter(v => v.status === 'available').length,
      rentedVehicles: fleet.filter(v => v.status === 'rented').length,
      activeBookings: bookings.filter(b => b.status === 'active').length
    },
    stats: stats.map(stat => ({
      metric: stat.title,
      value: stat.value,
      change: stat.change,
      trend: stat.trend
    })),
    bookings: bookings.map(booking => ({
      id: booking.id,
      customer: booking.customer,
      customerType: booking.customerType,
      vehicle: booking.car,
      startDate: booking.date,
      endDate: booking.returnDate,
      amount: booking.amount,
      status: booking.status,
      paymentStatus: booking.payment
    })),
    fleet: fleet.map(vehicle => ({
      name: vehicle.name,
      plate: vehicle.plate,
      status: vehicle.status,
      price: vehicle.price,
      location: vehicle.location,
      nextService: vehicle.nextService
    }))
  };
  
  // Create a comprehensive report
  const reportContent = `
AUTORENT PRO - DASHBOARD REPORT
Generated: ${reportData.metadata.exportDate}
Time Range: ${timeRange}

=== SUMMARY ===
Total Vehicles: ${reportData.metadata.totalVehicles}
Available Vehicles: ${reportData.metadata.availableVehicles}
Rented Vehicles: ${reportData.metadata.rentedVehicles}
Active Bookings: ${reportData.metadata.activeBookings}
Total Bookings: ${reportData.metadata.totalBookings}

=== STATISTICS ===
${reportData.stats.map(stat => `${stat.metric}: ${stat.value} (${stat.change})`).join('\n')}

=== RECENT BOOKINGS ===
${reportData.bookings.map(booking => `#${booking.id}: ${booking.customer} - ${booking.vehicle} - ${booking.amount} - ${booking.status}`).join('\n')}

=== FLEET STATUS ===
${reportData.fleet.map(vehicle => `${vehicle.name} (${vehicle.plate}): ${vehicle.status} - ${vehicle.location} - Next Service: ${vehicle.nextService}`).join('\n')}
  `.trim();
  
  downloadFile(
    `dashboard_report_${timeRange}_${new Date().toISOString().split('T')[0]}.txt`,
    reportContent,
    'text/plain'
  );
}