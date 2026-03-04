import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    // Get all cars with their current booking status
    const cars = await prisma.car.findMany({
      include: {
        bookings: {
          where: {
            OR: [
              { status: 'ACTIVE' },
              { status: 'CONFIRMED' },
            ]
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1 // Get only the most recent booking
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${cars.length} cars with booking info`);

    // Helper function to determine car status
    const getCarStatus = (car: any): 'available' | 'rented' | 'maintenance' => {
      if (!car.isAvailable) {
        console.log(`Car ${car.id} is in maintenance`);
        return 'maintenance';
      }
      
      const hasActiveBooking = car.bookings.some((b: any) => b.status === 'ACTIVE');
      const hasConfirmedBooking = car.bookings.some((b: any) => b.status === 'CONFIRMED');
      
      if (hasActiveBooking || hasConfirmedBooking) {
        console.log(`Car ${car.id} is rented (Active: ${hasActiveBooking}, Confirmed: ${hasConfirmedBooking})`);
        return 'rented';
      }
      
      console.log(`Car ${car.id} is available`);
      return 'available';
    };

    // Helper function to get current renter
    const getCurrentRenter = (car: any): string | null => {
      const activeBooking = car.bookings.find((b: any) => b.status === 'ACTIVE');
      const confirmedBooking = car.bookings.find((b: any) => b.status === 'CONFIRMED');
      
      if (activeBooking) {
        return `${activeBooking.user.firstName} ${activeBooking.user.lastName}`;
      }
      
      if (confirmedBooking) {
        return `${confirmedBooking.user.firstName} ${confirmedBooking.user.lastName}`;
      }
      
      return null;
    };

    // Helper function to get fuel percentage
    const getFuelPercentage = (fuelType: string): string => {
      const fuelMap: Record<string, string> = {
        'PETROL': '85%',
        'DIESEL': '90%',
        'ELECTRIC': '95%',
        'HYBRID': '80%'
      };
      return `${fuelType} ${fuelMap[fuelType] || '75%'}`;
    };

    // Helper function to get next service date
    const getNextService = (car: any): string => {
      const status = getCarStatus(car);
      if (status === 'rented') {
        return 'After return';
      }
      if (status === 'maintenance') {
        return 'In Service';
      }
      return '5000 km'; // Default for available cars
    };

    const formattedCars = cars.map(car => {
      const currentStatus = getCarStatus(car);
      const currentRenter = getCurrentRenter(car);
      
      // Generate plate number from car ID
      const plateNumber = `CAR-${car.id.toString().padStart(4, '0')}`;
      
      return {
        id: car.id,
        name: `${car.year} ${car.make} ${car.model}`,
        plate: plateNumber,
        status: currentStatus,
        year:car.year,
        make:car.make,
        model:car.model,
        rating: car.rating,
        price: `ksh${car.price}/day`,
        type: car.category,
        fuel: getFuelPercentage(car.fuelType),
        location: car.location || 'Not specified',
        nextService: getNextService(car),
        mileage: '0 km',
        isAvailable: car.isAvailable,
        image: car.image,
        currentRenter: currentRenter,
      };
    });

    console.log(`Formatted ${formattedCars.length} cars`);
    console.log('First car FULL details:', JSON.stringify(formattedCars[0], null, 2));

    // Filter by status if provided
    let filteredCars = formattedCars;
    if (status) {
      filteredCars = formattedCars.filter(car => car.status === status);
      console.log(`Filtered to ${filteredCars.length} cars with status: ${status}`);
    }
console.log('Response being sent:', JSON.stringify(filteredCars, null, 2));
    return NextResponse.json(filteredCars);
  } catch (error) {
    console.error('Error fetching fleet:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch fleet vehicles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}