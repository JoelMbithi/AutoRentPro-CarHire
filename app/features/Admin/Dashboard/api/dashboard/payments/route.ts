// app/api/dashboard/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Filters
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const method = searchParams.get('method') || '';
    
    // Build where clause
    const where: any = {};
    
    // Status filter
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }
    
    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    
    // Search filter (by customer name, email, phone, or transaction ID)
    if (search) {
      where.OR = [
        { transactionId: { contains: search, mode: 'insensitive' } },
        { checkoutRequestID: { contains: search, mode: 'insensitive' } },
        { mpesaReceiptNumber: { contains: search, mode: 'insensitive' } },
        { user: { 
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } }
          ]
        }}
      ];
    }
    
    // Get payments with related data
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          car: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true
            }
          },
          booking: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              status: true
            }
          }
        }
      }),
      prisma.payment.count({ where })
    ]);
    
    // Transform the data to match your frontend format
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      paymentId: `PMT${payment.id.toString().padStart(3, '0')}`,
      transactionId: payment.transactionId,
      checkoutRequestID: payment.checkoutRequestID,
      customer: `${payment.user.firstName} ${payment.user.lastName}`,
      customerEmail: payment.user.email,
      customerPhone: payment.user.phone,
      amount: payment.amount,
      date: payment.createdAt,
      method: 'MPesa', // Default, you can extend this based on your payment methods
      status: payment.status,
      invoice: `#INV-${payment.id.toString().padStart(3, '0')}`,
      receiptNumber: payment.mpesaReceiptNumber,
      car: payment.car ? `${payment.car.year} ${payment.car.make} ${payment.car.model}` : 'Unknown Car',
      bookingDates: payment.booking ? 
        `${payment.booking.startDate.toLocaleDateString()} - ${payment.booking.endDate.toLocaleDateString()}` : 
        'N/A',
      failureReason: payment.failureReason,
      bookingStatus: payment.booking?.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedPayments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}