import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Find user with valid code
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetCode: code,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      resetToken: user.resetToken,
    });

  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}