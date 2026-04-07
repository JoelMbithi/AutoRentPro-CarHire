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

    const { userId, isVerified } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: isVerified },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isVerified: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: `User ${isVerified ? 'approved' : 'unapproved'} successfully` 
    });

  } catch (error) {
    console.error("Error updating verification:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}