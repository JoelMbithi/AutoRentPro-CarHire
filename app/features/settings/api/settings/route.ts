import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
};

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      tab, 
      accountData, 
      notifications, 
      privacy, 
      preferences, 
      security 
    } = body;

    // First, check if user profile exists
    let userProfile = await prisma.userProfile.findUnique({
      where: { userId: decoded.id }
    });

    // Prepare update data based on the tab
    const updateData: any = {};

    if (tab === 'account' && accountData) {
      // Update user table for account information
      await prisma.user.update({
        where: { id: decoded.id },
        data: {
          firstName: accountData.firstName || '',
          lastName: accountData.lastName || '',
          email: accountData.email || '',
          phone: accountData.phone || '',
          updatedAt: new Date()
        }
      });
    }
    
    if (tab === 'notifications' && notifications) {
      updateData.notifications = notifications;
    }
    
    if (tab === 'privacy' && privacy) {
      updateData.privacy = privacy;
    }
    
    if (tab === 'preferences' && preferences) {
      updateData.preferences = preferences;
    }
    
    if (tab === 'security' && security) {
      updateData.security = security;
    }

    // If there's any data to update in userProfile
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();

      if (userProfile) {
        // Update existing user profile
        userProfile = await prisma.userProfile.update({
          where: { userId: decoded.id },
          data: updateData
        });
      } else {
        // Create new user profile
        userProfile = await prisma.userProfile.create({
          data: {
            userId: decoded.id,
            ...updateData
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      userProfile
    });

  } catch (error) {
    console.error('Settings save error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Fetch user with profile
    const userWithProfile = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        userProfile: true
      }
    });

    if (!userWithProfile) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Return default settings if none exist
    const defaultSettings = {
      notifications: {
        email: true,
        sms: true,
        bookingUpdates: true,
        promotional: false,
        priceAlerts: true,
      },
      privacy: {
        showProfile: true,
        allowMessages: true,
        showRecentBookings: false,
        dataSharing: false,
      },
      preferences: {
        preferredVehicleType: 'SUV',
        defaultPickupLocation: '',
        defaultPaymentMethod: 'card',
        language: 'en',
        currency: 'USD',
        theme: 'light',
      },
      security: {
        twoFactorAuth: false,
        loginAlerts: true,
        autoLogout: true,
        sessionTimeout: 30,
      }
    };

    const settings = {
      notifications: userWithProfile.userProfile?.notifications || defaultSettings.notifications,
      privacy: userWithProfile.userProfile?.privacy || defaultSettings.privacy,
      preferences: userWithProfile.userProfile?.preferences || defaultSettings.preferences,
      security: userWithProfile.userProfile?.security || defaultSettings.security,
    };

    return NextResponse.json({
      success: true,
      settings,
      user: {
        id: userWithProfile.id,
        firstName: userWithProfile.firstName,
        lastName: userWithProfile.lastName,
        email: userWithProfile.email,
        phone: userWithProfile.phone,
        createdAt: userWithProfile.createdAt
      }
    });

  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}