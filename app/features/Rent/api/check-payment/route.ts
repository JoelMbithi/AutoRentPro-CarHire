// app/api/check-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { checkoutRequestID } = await req.json();
    
    console.log(' Checking payment status for:', checkoutRequestID);

    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestID },
      include: { booking: true }
    });

    if (!payment) {
      return NextResponse.json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    return NextResponse.json({
      success: true,
      paymentStatus: payment.status,
      bookingStatus: payment.booking?.status,
      message: getStatusMessage(payment.status),
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        failureReason: payment.failureReason
      }
    });

  } catch (error) {
    console.error(' Payment status check error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error checking payment status' 
    });
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'Payment completed successfully';
    case 'FAILED':
      return 'Payment failed or was cancelled';
    case 'PENDING':
      return 'Waiting for payment confirmation';
    default:
      return 'Payment status unknown';
  }
}