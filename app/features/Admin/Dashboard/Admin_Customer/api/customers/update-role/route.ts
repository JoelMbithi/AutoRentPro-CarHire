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

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const validRoles = ['CUSTOMER', 'AGENT', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      }
    });

    // If promoting to AGENT, set initial values
    if (role === 'AGENT') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          commission: 15.0,
          totalCars: 0,
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: `User role updated to ${role} successfully` 
    });

  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}