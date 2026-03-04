import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, code, password } = await request.json();

    if ((!token && !code) || !password) {
      return NextResponse.json(
        { success: false, error: "Token/code and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Find user with valid token OR code
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { resetToken: token },
          { resetCode: code }
        ],
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token/code" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token and code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetCode: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Password reset successful" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}