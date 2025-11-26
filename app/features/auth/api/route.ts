// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'



import { hashPassword, generateToken, validateEmail, validatePassword } from '@/app/features/auth/utils/utils'
import prisma from '@/lib/prisma'




export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, drivingLicense, dateOfBirth, address } = body

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !drivingLicense) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)

    const user  = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        drivingLicense,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address,
        userProfile: {
          create: {}
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        drivingLicense: true,
        role: true,
        createdAt: true
      }
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Create response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user,
      token
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}