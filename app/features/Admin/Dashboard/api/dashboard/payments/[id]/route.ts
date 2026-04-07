// app/api/dashboard/payments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Remove the interface Params - we'll type it inline

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await params;  
    const paymentId = parseInt(id);
    
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            drivingLicense: true,
            address: true,
            city: true,
            country: true
          }
        },
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
            image: true,
            fuelType: true,
            seats: true,
            transmission: true
          }
        },
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
            status: true,
            pickupLocation: true,
            dropoffLocation: true,
            specialRequests: true
          }
        }
      }
    });
    
    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Format the response
    const formattedPayment = {
      id: payment.id,
      paymentId: `PMT${payment.id.toString().padStart(3, '0')}`,
      transactionId: payment.transactionId,
      checkoutRequestID: payment.checkoutRequestID,
      customer: {
        id: payment.user.id,
        name: `${payment.user.firstName} ${payment.user.lastName}`,
        email: payment.user.email,
        phone: payment.user.phone,
        drivingLicense: payment.user.drivingLicense,
        address: payment.user.address,
        city: payment.user.city,
        country: payment.user.country
      },
      car: payment.car ? {
        id: payment.car.id,
        name: `${payment.car.year} ${payment.car.make} ${payment.car.model}`,
        price: payment.car.price,
        image: payment.car.image,
        fuelType: payment.car.fuelType,
        seats: payment.car.seats,
        transmission: payment.car.transmission
      } : null,
      booking: payment.booking ? {
        id: payment.booking.id,
        bookingId: `BK${payment.booking.id.toString().padStart(4, '0')}`,
        startDate: payment.booking.startDate,
        endDate: payment.booking.endDate,
        duration: Math.ceil(
          (payment.booking.endDate.getTime() - payment.booking.startDate.getTime()) / 
          (1000 * 60 * 60 * 24)
        ) + ' days',
        totalPrice: payment.booking.totalPrice,
        status: payment.booking.status,
        pickupLocation: payment.booking.pickupLocation,
        dropoffLocation: payment.booking.dropoffLocation,
        specialRequests: payment.booking.specialRequests
      } : null,
      amount: payment.amount,
      status: payment.status,
      method: 'MPesa', 
      invoice: `#INV-${payment.id.toString().padStart(3, '0')}`,
      receiptNumber: payment.mpesaReceiptNumber,
      accountReference: payment.accountReference,
      transactionDesc: payment.transactionDesc,
      failureReason: payment.failureReason,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      metadata: payment.metadata
    };
    
    return NextResponse.json({
      success: true,
      data: formattedPayment
    });
    
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
}