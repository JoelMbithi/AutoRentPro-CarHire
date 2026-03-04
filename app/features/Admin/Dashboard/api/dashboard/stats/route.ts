import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || 'month';

    // Calculate date range
    const now = new Date();
    let startDate: Date = new Date();

    switch (timeRange) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    // Get total revenue from completed payments
    const revenueData = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate }
      },
      _sum: { amount: true },
      _count: true
    });

    // Get active bookings (ACTIVE status)
    const activeBookings = await prisma.booking.count({
      where: { status: 'ACTIVE' }
    });

    // Get pending bookings (PENDING and CONFIRMED)
    const pendingBookings = await prisma.booking.count({
      where: { 
        OR: [
          { status: 'PENDING' },
          { status: 'CONFIRMED' }
        ]
      }
    });

    // Get total customers
    const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    });

    // Get total cars
    const totalCars = await prisma.car.count();

    // Get available cars (not in maintenance and not booked)
    const availableCars = await prisma.car.count({
      where: { 
        isAvailable: true,
        bookings: {
          none: {
            OR: [
              { status: 'ACTIVE' },
              { status: 'CONFIRMED' }
            ]
          }
        }
      }
    });

    // Get cars currently rented (ACTIVE or CONFIRMED bookings)
    const rentedCars = await prisma.car.count({
      where: {
        bookings: {
          some: {
            OR: [
              { status: 'ACTIVE' },
              { status: 'CONFIRMED' }
            ]
          }
        }
      }
    });

    // Get customer satisfaction (average rating from car reviews)
    const avgRating = await prisma.car.aggregate({
      _avg: { rating: true }
    });

    // Calculate changes (you might want to compare with previous period)
    const previousStartDate = new Date(startDate);
    switch (timeRange) {
      case 'day':
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        break;
      case 'week':
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        break;
      case 'month':
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);
        break;
      case 'year':
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
        break;
    }

    // Get previous period revenue for comparison
    const previousRevenueData = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { 
          gte: previousStartDate,
          lt: startDate
        }
      },
      _sum: { amount: true }
    });

    const currentRevenue = revenueData._sum.amount || 0;
    const previousRevenue = previousRevenueData._sum.amount || 0;
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : '100';

    return NextResponse.json({
      totalRevenue: currentRevenue,
      activeBookings,
      pendingBookings,
      totalCustomers,
      totalCars,
      availableCars,
      rentedCars,
      customerSatisfaction: avgRating._avg.rating || 4.8,
      totalTransactions: revenueData._count,
      revenueChange: parseFloat(revenueChange) > 0 ? `+${revenueChange}%` : `${revenueChange}%`,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}


