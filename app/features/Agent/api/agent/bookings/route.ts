import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// GET - Fetch bookings for vehicles owned by the logged-in agent
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
      select: { role: true }
    });

    if (!user || user.role !== 'AGENT') {
      return NextResponse.json({ success: false, error: "Access denied. Agent only." }, { status: 403 });
    }

    // Get all bookings for cars owned by this agent
    const bookings = await prisma.booking.findMany({
      where: {
        car: {
          ownerId: decoded.id  // Only bookings for this agent's cars
        }
      },
      include: {
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            image: true,
            plateNumber: true,
            price: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format bookings for frontend
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      customerName: `${booking.user.firstName} ${booking.user.lastName}`,
      customerEmail: booking.user.email,
      customerPhone: booking.user.phone,
      vehicleName: `${booking.car.make} ${booking.car.model}`,
      vehicleImage: booking.car.image,
      plateNumber: booking.car.plateNumber,
      startDate: booking.startDate,
      endDate: booking.endDate,
      amount: booking.totalPrice,
      status: booking.status,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      createdAt: booking.createdAt
    }));

    return NextResponse.json({ 
      success: true, 
      bookings: formattedBookings,
      total: formattedBookings.length
    });
    
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}