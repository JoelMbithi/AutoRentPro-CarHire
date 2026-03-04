import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { UserRole } from '@/app/generated/prisma/enums';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get form fields
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = formData.get("role") as string;
    const userType = formData.get("userType") as string; // 'admin' or 'owner'

    // Split full name
    const nameParts = fullName?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Car owner specific fields
    const address = formData.get("address") as string;
    const licenseNumber = formData.get("licenseNumber") as string;
    const carMake = formData.get("carMake") as string;
    const carModel = formData.get("carModel") as string;
    const carYear = formData.get("carYear") as string;
    const carColor = formData.get("carColor") as string;
    const plateNumber = formData.get("plateNumber") as string;

    // Validation
    const errors: Record<string, string> = {};

    // Required fields for all users
    if (!fullName) errors.fullName = "Full name is required";
    if (!email) errors.email = "Email is required";
    if (!phone) errors.phone = "Phone number is required";
    if (!password) errors.password = "Password is required";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";

    // Email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    // Phone format validation
    if (phone && !/^\+?[\d\s-]{10,}$/.test(phone)) {
      errors.phone = "Invalid phone number format";
    }

    // Password validation
    if (password) {
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      if (!/[A-Z]/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter";
      }
      if (!/[0-9]/.test(password)) {
        errors.password = "Password must contain at least one number";
      }
    }

    // Password match validation
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Car owner specific validation
    if (userType === 'owner') {
      if (!address) errors.address = "Address is required";
      if (!licenseNumber) errors.licenseNumber = "Driver's license number is required";
      if (!carMake) errors.carMake = "Car make is required";
      if (!carModel) errors.carModel = "Car model is required";
      if (!carYear) errors.carYear = "Car year is required";
      if (!carColor) errors.carColor = "Car color is required";
      if (!plateNumber) errors.plateNumber = "Plate number is required";

      // Year validation
      if (carYear) {
        const year = parseInt(carYear);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
          errors.carYear = `Year must be between 1900 and ${currentYear + 1}`;
        }
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      errors.email = "Email already registered";
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user based on type
    if (userType === 'admin') {
      // Create admin user with proper enum
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword,
          drivingLicense: 'ADMIN',
          role: UserRole.ADMIN, // Use enum directly
          isVerified: true,
        }
      });

      return NextResponse.json({
        success: true,
        message: "Admin registered successfully",
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role
        }
      });

    } else if (userType === 'owner') {
      // Create car owner user with proper enum
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword,
          drivingLicense: licenseNumber,
          address,
          role: UserRole.AGENT, // Use enum directly
          isVerified: false,
          // Optional owner fields
          commission: 15.0,
          totalCars: 1,
        }
      });

      // Create car for the owner
      const car = await prisma.car.create({
        data: {
          make: carMake,
          model: carModel,
          year: carYear,
          price: "0",
          image: "/default-car.png",
          fuelType: "PETROL",
          seats: 5,
          transmission: "AUTOMATIC",
          drive: "FWD",
          category: "STANDARD",
          rating: 0,
          reviews: 0,
          power: "150hp",
          isAvailable: true,
          location: address,
          ownerId: user.id, // Link car to owner
        }
      });

      return NextResponse.json({
        success: true,
        message: "Car owner registered successfully",
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role
        },
        car: {
          id: car.id,
          make: car.make,
          model: car.model
        }
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid user type" },
      { status: 400 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred during registration",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}