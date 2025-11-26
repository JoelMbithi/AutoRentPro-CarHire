import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CarCategory, DriveType, FuelType, Transmission } from "@/app/generated/prisma/enums";


// GET - Get all cars with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const category = searchParams.get('category') as CarCategory | null;
    const fuelType = searchParams.get('fuelType') as FuelType | null;
    const transmission = searchParams.get('transmission') as Transmission | null;
    const drive = searchParams.get('drive') as DriveType | null;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const seats = searchParams.get('seats');
    const search = searchParams.get('search');
    const availableOnly = searchParams.get('availableOnly') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause for filtering
    const where: any = {};

    if (category) where.category = category;
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;
    if (drive) where.drive = drive;
    if (seats) where.seats = parseInt(seats);
    if (availableOnly) where.isAvailable = true;
    
    // Search across make and model
    if (search) {
      where.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          price: true,
          image: true,
          fuelType: true,
          seats: true,
          transmission: true,
          drive: true,
          category: true,
          rating: true,
          reviews: true,
          power: true,
          isAvailable: true,
          location: true,
          createdAt: true,
        },
      }),
      prisma.car.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: cars,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext,
        hasPrev,
      },
    });

  } catch (error: any) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch cars" 
      },
      { status: 500 }
    );
  }
}