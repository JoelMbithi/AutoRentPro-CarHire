import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    // Remove or make limit VERY high to get all bookings
    const limitParam = searchParams.get('limit');
    // Default to 1000 to ensure we get ALL bookings
    const limit = limitParam ? parseInt(limitParam) : 1000;

    // Build where clause
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Get ALL bookings
    const bookings = await prisma.booking.findMany({
      where,
      take: limit, // Will get up to 1000 bookings
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          }
        },
        car: {
          select: {
            make: true,
            model: true,
            year: true,
            image: true,
          }
        },
        payment: {
          select: {
            status: true,
            amount: true,
          }
        }
      }
    });

    console.log(`📊 Fetched ${bookings.length} bookings from database (should be 27)`);

    // Calculate customer type based on total spent
    const customerTotalSpent: Record<number, number> = {};
    
    // Get ALL user IDs from ALL bookings to calculate totals
    const allUserBookings = await prisma.booking.groupBy({
      by: ['userId'],
      where: {
        // Optional: filter by payment status if you only want completed payments
        payment: {
          status: 'COMPLETED'
        }
      },
      _sum: {
        totalPrice: true
      }
    });

    allUserBookings.forEach(item => {
      if (item.userId) {
        customerTotalSpent[item.userId] = item._sum.totalPrice || 0;
      }
    });

    const formattedBookings = bookings.map(booking => {
      const durationMs = new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime();
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
      
      const totalSpent = customerTotalSpent[booking.userId] || 0;
      let customerType = 'Regular';
      if (totalSpent > 5000) customerType = 'VIP';
      else if (totalSpent > 2000) customerType = 'Premium';
      else if (totalSpent > 1000) customerType = 'Corporate';

      // Determine priority
      const priority = customerType === 'Premium' || customerType === 'Corporate' || 
                       customerType === 'VIP' ? 'high' : 'normal';

      // Map status to lowercase for UI
      const uiStatus = booking.status.toLowerCase();

      return {
        id: `#BK${booking.id.toString().padStart(4, '0')}`,
        bookingId: booking.id,
        customer: `${booking.user?.firstName || 'Unknown'} ${booking.user?.lastName || 'User'}`,
        customerEmail: booking.user?.email || 'No email',
        customerPhone: booking.user?.phone || 'No phone',
        customerType,
        customerRole: booking.user?.role || 'CUSTOMER',
        car: `${booking.car?.year || ''} ${booking.car?.make || ''} ${booking.car?.model || ''}`.trim(),
        carImage: booking.car?.image,
        date: booking.startDate.toISOString().split('T')[0],
        returnDate: booking.endDate.toISOString().split('T')[0],
        duration: `${durationDays} days`,
        amount: `ksh${booking.totalPrice.toFixed(2)}`,
        totalPrice: booking.totalPrice,
        status: booking.status,
        uiStatus: uiStatus,
        payment: booking.payment?.status === 'COMPLETED' ? 'paid' : 'pending',
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        specialRequests: booking.specialRequests || undefined,
        priority,
        createdAt: booking.createdAt,
        userId: booking.userId,
      };
    });

    // Get total count for verification
    const totalBookings = await prisma.booking.count({ where });

    return NextResponse.json(formattedBookings); 
  } catch (error) {
    console.error('Error fetching bookings:', error);
    // Return empty array on error
    return NextResponse.json([]);
  }
}