import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password, rememberMe } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    // Email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        ownedCars: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            image: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid email or password" 
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid email or password" 
        },
        { status: 401 }
      );
    }

    // Check if user is verified (for owners)
    if (user.role === 'AGENT' && !user.isVerified) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Your account is pending verification. Please wait for admin approval." 
        },
        { status: 403 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      JWT_SECRET,
      { expiresIn: rememberMe ? '7d' : '24h' }
    );

    // Determine dashboard redirect based on role
    let dashboardUrl = '/features/Admin/Dashboard';
    if (user.role === 'AGENT') {
      dashboardUrl = '/features/Agent/Dashboard';
    } else if (user.role === 'CUSTOMER') {
      dashboardUrl = '/';
    }

    // Return success with token and user info
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        ...(user.role === 'AGENT' && {
          totalCars: user.totalCars,
          commission: user.commission,
          cars: user.ownedCars
        })
      },
      dashboardUrl
    });

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred during login",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}