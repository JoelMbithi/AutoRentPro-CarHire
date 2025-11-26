import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const featuredCars = await prisma.car.findMany({
      where: {
        isAvailable: true,
        rating: { gte: 4.5 }, // High-rated cars
      },
      take: 6,
      orderBy: [
        { rating: 'desc' },
        { reviews: 'desc' },
      ],
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
        category: true,
        rating: true,
        reviews: true,
        power: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: featuredCars,
    });

  } catch (error: any) {
    console.error("Error fetching featured cars:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch featured cars" 
      },
      { status: 500 }
    );
  }
}