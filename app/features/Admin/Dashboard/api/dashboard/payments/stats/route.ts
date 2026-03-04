import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || 'month';
    
    // Calculate date range
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
    
    // Get statistics in parallel for performance
    const [
      totalRevenue,
      pendingPayments,
      thisMonthRevenue,
      totalTransactions,
      paymentMethodsData,
      statusCounts
    ] = await Promise.all([
      // Total revenue (all completed payments)
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
        _count: true
      }),
      
      // Pending payments - REMOVED DATE FILTER to get ALL pending payments
      prisma.payment.aggregate({
        where: { status: 'PENDING' }, // Date filter removed
        _sum: { amount: true }
      }),
      
      // This month revenue
      prisma.payment.aggregate({
        where: { 
          status: 'COMPLETED',
          createdAt: { 
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { amount: true }
      }),
      
      // Total transactions count
      prisma.payment.count(),
      
      // Payment methods distribution (you can extend this based on your methods)
      prisma.payment.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate } },
        _count: true
      }),
      
      // Status counts
      prisma.payment.groupBy({
        by: ['status'],
        _count: true
      })
    ]);
    
    // Calculate average transaction value
    const avgTransactionValue = totalRevenue._count > 0 
      ? (totalRevenue._sum.amount || 0) / totalRevenue._count 
      : 0;
    
    // Format payment methods data
    const paymentMethods = [
      { method: 'MPesa', count: paymentMethodsData.find(p => p.status === 'COMPLETED')?._count || 0, percentage: '58%', color: 'bg-blue-500' },
      { method: 'Credit Card', count: 0, percentage: '25%', color: 'bg-blue-400' },
      { method: 'Bank Transfer', count: 0, percentage: '12%', color: 'bg-emerald-500' },
      { method: 'Cash', count: 0, percentage: '5%', color: 'bg-gray-500' },
    ];
    
    // Calculate actual percentages
    const totalMethodCount = paymentMethods.reduce((sum, method) => sum + method.count, 0);
    paymentMethods.forEach(method => {
      method.percentage = totalMethodCount > 0 
        ? `${Math.round((method.count / totalMethodCount) * 100)}%` 
        : '0%';
    });
    
    return NextResponse.json({
      success: true,
      data: {
        // Summary stats
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingPayments: pendingPayments._sum.amount || 0, // Now shows ALL pending payments
        thisMonthRevenue: thisMonthRevenue._sum.amount || 0,
        avgTransactionValue,
        totalTransactions,
        
        // Status distribution
        statusDistribution: statusCounts.map(item => ({
          status: item.status,
          count: item._count,
          percentage: Math.round((item._count / totalTransactions) * 100)
        })),
        
        // Payment methods
        paymentMethods,
        
        // Time-based stats
        timeRange,
        startDate,
        endDate: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment statistics' },
      { status: 500 }
    );
  }
}