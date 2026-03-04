import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security reasons, don't reveal if user exists or not
    if (!user) {
      return NextResponse.json(
        { 
          success: true, 
          message: "If an account exists with this email, you will receive a reset link and code" 
        },
        { status: 200 }
      );
    }

    // Generate reset token and 6-digit code
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store token and code in database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetCode,
        resetTokenExpiry,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    // Send email with both link and code
    try {
      await sendResetPasswordEmail({
        to: user.email,
        userName: user.firstName || user.email.split('@')[0],
        resetUrl: resetUrl,
        resetCode: resetCode
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Still return success for security, but log the error
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "If an account exists with this email, you will receive a reset link and code" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}