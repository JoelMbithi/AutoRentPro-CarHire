// app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || 'month';

    // Get total revenue (completed payments)
    const now = new Date();
    let startDate: Date;

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
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Get total revenue
    const revenueData = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate }
      },
      _sum: { amount: true },
      _count: true
    });

    // Get active bookings
    const activeBookings = await prisma.booking.count({
      where: { status: 'ACTIVE' }
    });

    // Get pending bookings
    const pendingBookings = await prisma.booking.count({
      where: { status: 'PENDING' }
    });

    // Get total customers
const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    });

    // Get verified/active customers
    const activeCustomers = await prisma.user.count({
      where: { 
        role: 'CUSTOMER',
        isVerified: true 
      }
    });

    // Get VIP members (customers with high spending)
    const vipThreshold = 5000; // Define what makes a VIP
    const vipMembers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        bookings: {
          some: {
            payment: {
              status: 'COMPLETED'
            }
          }
        }
      }
    });


 

    // Get total cars
    const totalCars = await prisma.car.count();

    // Get available cars
    const availableCars = await prisma.car.count({
      where: { isAvailable: true }
    });

    // Get customer satisfaction (average rating from car reviews)
    const avgRating = await prisma.car.aggregate({
      _avg: { rating: true }
    });

    return NextResponse.json({
      totalRevenue: revenueData._sum.amount || 0,
      activeBookings,
      pendingBookings,
      totalCustomers,
      totalCars,
      availableCars,
      customerSatisfaction: avgRating._avg.rating || 4.8,
      totalTransactions: revenueData._count,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}