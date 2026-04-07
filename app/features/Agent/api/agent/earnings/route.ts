import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// GET - Fetch earnings for the logged-in agent
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Verify user is an AGENT
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        role: true,
        commission: true
      }
    });

    if (!user || user.role !== 'AGENT') {
      return NextResponse.json({ success: false, error: "Access denied. Agent only." }, { status: 403 });
    }

    const commissionRate = user.commission || 15; // Default 15% commission for platform

    // Get all completed bookings for agent's cars
    const completedBookings = await prisma.booking.findMany({
      where: {
        car: {
          ownerId: decoded.id
        },
        status: 'COMPLETED'
      },
      include: {
        car: {
          select: {
            make: true,
            model: true,
            plateNumber: true
          }
        }
      },
      orderBy: { endDate: 'desc' }
    });

    // Get current month's bookings
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyBookings = completedBookings.filter(booking => 
      booking.endDate >= startOfMonth && booking.endDate <= endOfMonth
    );

    // Calculate earnings
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    // Owner gets (100% - commission%) of the revenue
    const ownerSharePercent = (100 - commissionRate) / 100;
    const totalEarnings = totalRevenue * ownerSharePercent;
    const monthlyEarnings = monthlyRevenue * ownerSharePercent;
    
    // Calculate pending payouts (completed bookings not yet paid out)
    // You can add a 'paidOut' field to Bookings model for better tracking
    const pendingEarnings = totalEarnings * 0.3; // Example: 30% pending (adjust based on your logic)

    // Get recent transactions (last 10 completed bookings)
    const recentTransactions = completedBookings.slice(0, 10).map(booking => ({
      id: booking.id,
      vehicleName: `${booking.car.make} ${booking.car.model}`,
      plateNumber: booking.car.plateNumber,
      amount: booking.totalPrice,
      ownerEarnings: booking.totalPrice * ownerSharePercent,
      platformCommission: booking.totalPrice * (commissionRate / 100),
      endDate: booking.endDate,
      status: booking.status
    }));

    // Get monthly breakdown for chart
    const monthlyBreakdown = await getMonthlyBreakdown(decoded.id, commissionRate);

    return NextResponse.json({ 
      success: true, 
      earnings: {
        total: Math.round(totalEarnings),
        monthly: Math.round(monthlyEarnings),
        pending: Math.round(pendingEarnings),
        commissionRate: commissionRate,
        totalRevenue: Math.round(totalRevenue),
        monthlyRevenue: Math.round(monthlyRevenue),
        totalBookings: completedBookings.length,
        monthlyBookings: monthlyBookings.length
      },
      recentTransactions,
      monthlyBreakdown
    });
    
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to get monthly earnings breakdown
async function getMonthlyBreakdown(ownerId: number, commissionRate: number) {
  const ownerSharePercent = (100 - commissionRate) / 100;
  const months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const bookings = await prisma.booking.findMany({
      where: {
        car: { ownerId },
        status: 'COMPLETED',
        endDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });
    
    const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const earnings = revenue * ownerSharePercent;
    
    months.push({
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      revenue: Math.round(revenue),
      earnings: Math.round(earnings),
      bookings: bookings.length
    });
  }
  
  return months;
}