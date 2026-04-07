import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and Password are required" },
        { status: 400 }
      );
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Find user with ALL profile data including cars for agents
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
        { success: false, error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    // Role-specific verification checks
    if (user.role === 'AGENT' && !user.isVerified) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Your account is pending verification. Please wait for admin approval." 
        },
        { status: 403 }
      );
    }

    // Create token with role and user data
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET!,
      { expiresIn: rememberMe ? "7d" : "1d" }
    );

    // Determine dashboard URL based on role
    let dashboardUrl = '/features/Admin/Dashboard';
    if (user.role === 'AGENT') {
      dashboardUrl = '/features/Agent/Dashboard';
    } else if (user.role === 'CUSTOMER') {
      dashboardUrl = '/';
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Sign in successful",
        user: {
          ...userWithoutPassword,
          ...(user.role === 'AGENT' && {
            totalCars: user.totalCars,
            commission: user.commission,
            cars: user.ownedCars
          })
        },
        dashboardUrl,
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("SignIn Error", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Auth check endpoint
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
      }
    });

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        ...(user.role === 'AGENT' && {
          // Include agent-specific data if needed
          
        })
      },
    });

  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}