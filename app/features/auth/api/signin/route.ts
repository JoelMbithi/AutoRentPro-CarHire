import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and Password are required" },
        { status: 400 }
      );
    }

    // Find user with proper selection
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        role: true,
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

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "6d" }
    );

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Sign in successful",
        user: userWithoutPassword, // This now has firstName and lastName
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 6 * 24 * 60 * 60, // 6 days
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
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });

  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

/* Logout */