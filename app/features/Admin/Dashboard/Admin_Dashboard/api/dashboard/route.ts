// app/features/Admin/Dashboard/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Local enum for consistency
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeRange = searchParams.get('timeRange') || 'month'

    // Calculate start date
    const now = new Date()
    let startDate: Date = new Date()

    switch (timeRange) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1))
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
    }

    // Fetch stats
    const revenueData = await prisma.payment.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: startDate } },
      _sum: { amount: true },
      _count: true,
    })

    const activeBookings = await prisma.booking.count({ where: { status: 'ACTIVE' } })

    const pendingBookings = await prisma.booking.count({
      where: { OR: [{ status: 'PENDING' }, { status: 'CONFIRMED' }] },
    })

    const totalCustomers = await prisma.user.count({ where: { role: UserRole.CUSTOMER } })

    const totalCars = await prisma.car.count()

    const availableCars = await prisma.car.count({
      where: {
        isAvailable: true,
        bookings: { none: { OR: [{ status: 'ACTIVE' }, { status: 'CONFIRMED' }] } },
      },
    })

    const rentedCars = await prisma.car.count({
      where: {
        bookings: { some: { OR: [{ status: 'ACTIVE' }, { status: 'CONFIRMED' }] } },
      },
    })

    const avgRating = await prisma.car.aggregate({ _avg: { rating: true } })

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: revenueData._sum.amount || 0,
        activeBookings,
        pendingBookings,
        totalCustomers,
        totalCars,
        availableCars,
        rentedCars,
        customerSatisfaction: avgRating._avg.rating || 4.8,
        totalTransactions: revenueData._count,
      },
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
