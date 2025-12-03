import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CarCategory } from "@/app/generated/prisma/enums";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const category = searchParams.get('category') as CarCategory | null;
    const search = searchParams.get('search'); // For location or general search
    const availableOnly = searchParams.get('availableOnly') === 'true';

    console.log("API Received params:", {
      category,
      search,
      availableOnly,
      allParams: Object.fromEntries(searchParams.entries())
    });

    // Build where clause for filtering
    const where: any = {};

    // Category filter
    if (category) {
      where.category = category;
    }
    
    // Available only filter
    if (availableOnly) {
      where.isAvailable = true;
    }
    
    // Search filter - search in location, make, or model
    if (search) {
      where.OR = [
        { location: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    console.log("Prisma where clause:", JSON.stringify(where, null, 2));

    // Execute query
    const cars = await prisma.car.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
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
    });

    console.log(`Found ${cars.length} cars`);

    return NextResponse.json({
      success: true,
      data: cars,
      count: cars.length,
    });

  } catch (error: any) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch cars",
        details: error.message 
      },
      { status: 500 }
    );
  }
}