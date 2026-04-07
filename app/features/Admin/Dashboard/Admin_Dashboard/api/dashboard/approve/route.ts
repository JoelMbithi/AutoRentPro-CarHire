import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Verify user is ADMIN
    const admin = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { role: true }
    });

    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ success: false, error: "Access denied. Admin only." }, { status: 403 });
    }

    const { paymentId, status } = await request.json();

    if (!paymentId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Update payment status
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: status },
    });

    // If payment is completed, also update the associated booking
    if (status === 'COMPLETED' && payment.bookingId) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' },
      });
    }

    // If payment is failed, update booking status
    if (status === 'FAILED' && payment.bookingId) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CANCELLED' },
      });
    }

    return NextResponse.json({ 
      success: true, 
      payment,
      message: `Payment ${status.toLowerCase()} successfully` 
    });

  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}