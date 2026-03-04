// app/api/dashboard/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'bookings', 'fleet', 'stats'
    const format = searchParams.get('format') || 'csv';
    
    let data: any[] = [];
    let filename = '';
    
    switch (type) {
      case 'bookings':
        const bookings = await prisma.booking.findMany({
          take: 100,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            car: { select: { make: true, model: true, year: true } },
            payment: { select: { status: true } }
          }
        });
        
        data = bookings.map(booking => ({
          'Booking ID': `#BK${booking.id}`,
          'Customer': `${booking.user.firstName} ${booking.user.lastName}`,
          'Email': booking.user.email,
          'Vehicle': `${booking.car.year} ${booking.car.make} ${booking.car.model}`,
          'Start Date': booking.startDate.toISOString().split('T')[0],
          'End Date': booking.endDate.toISOString().split('T')[0],
          'Total Price': `$${booking.totalPrice}`,
          'Status': booking.status,
          'Payment Status': booking.payment?.status || 'pending'
        }));
        filename = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      case 'fleet':
        const cars = await prisma.car.findMany({
          orderBy: { createdAt: 'desc' }
        });
        
        data = cars.map(car => ({
          'Vehicle': `${car.year} ${car.make} ${car.model}`,
          'Price': `$${car.price}/day`,
          'Category': car.category,
          'Fuel Type': car.fuelType,
          'Seats': car.seats,
          'Transmission': car.transmission,
          'Rating': car.rating,
          'Available': car.isAvailable ? 'Yes' : 'No',
          'Location': car.location || 'N/A'
        }));
        filename = `fleet_${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid export type' },
          { status: 400 }
        );
    }
    
    // Convert to CSV
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => 
        `"${String(value).replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');
    
    // Return as file download
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
    
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate export' },
      { status: 500 }
    );
  }
}