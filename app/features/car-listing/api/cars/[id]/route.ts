import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get single car by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid car ID" },
        { status: 400 }
      );
    }

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        bookings: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
          },
          where: {
            status: {
              in: ['CONFIRMED', 'ACTIVE']
            }
          }
        }
      }
    });

    if (!car) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: car,
    });

  } catch (error: any) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch car" 
      },
      { status: 500 }
    );
  }
}