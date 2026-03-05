import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Count completed bookings for the user
    const completedCount = await prisma.booking.count({
      where: {
        userId: parseInt(userId),
        status: 'COMPLETED'
      }
    });

    // Calculate points (100 points per completed booking)
    const points = completedCount * 100;

    return NextResponse.json({
      success: true,
      count: completedCount,
      points: points
    });

  } catch (error) {
    console.error('Error fetching completed bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch completed bookings' },
      { status: 500 }
    );
  }
}