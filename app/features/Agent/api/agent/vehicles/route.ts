import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { FuelType, Transmission, DriveType, CarCategory } from '@/app/generated/prisma/enums';

// GET - Fetch ONLY vehicles owned by the logged-in agent
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Verify user is an AGENT
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { role: true }
    });

    if (!user || user.role !== 'AGENT') {
      return NextResponse.json({ success: false, error: "Access denied. Agent only." }, { status: 403 });
    }

    // Fetch ONLY vehicles where ownerId matches the logged-in agent
    const vehicles = await prisma.car.findMany({
      where: { 
        ownerId: decoded.id  // Critical: Only this agent's vehicles
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST - Add a vehicle (links to logged-in agent)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Verify user is an AGENT
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { role: true }
    });

    if (!user || user.role !== 'AGENT') {
      return NextResponse.json({ success: false, error: "Access denied. Agent only." }, { status: 403 });
    }

    const formData = await request.formData();
    
    // Get text fields
    const make = formData.get('make') as string;
    const model = formData.get('model') as string;
    const year = formData.get('year') as string;
    const price = formData.get('price') as string;
    const fuelType = formData.get('fuelType') as string;
    const seats = formData.get('seats') as string;
    const transmission = formData.get('transmission') as string;
    const drive = formData.get('drive') as string;
    const category = formData.get('category') as string;
    const power = formData.get('power') as string;
    const location = formData.get('location') as string;
    const plateNumber = formData.get('plateNumber') as string;
    
    // Get image file
    const imageFile = formData.get('image') as File | null;
    
    // Validate required fields
    if (!make || !model || !year || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    let imagePath = '';
    
    // Handle image upload if present
    if (imageFile) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const timestamp = Date.now();
        const originalName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${timestamp}_${originalName}`;
        
        const uploadDir = path.join(process.cwd(), 'public/uploads/vehicles');
        const filePath = path.join(uploadDir, filename);
        
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }
        
        await writeFile(filePath, buffer);
        imagePath = `/uploads/vehicles/${filename}`;
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }
    
    // Create vehicle with ownerId set to logged-in agent
    const vehicle = await prisma.car.create({
      data: {
        make,
        model,
        year,
        price: `KSH ${price}`,
        fuelType: fuelType as FuelType,
        seats: seats ? parseInt(seats) : 5,
        transmission: transmission as Transmission,
        drive: drive as DriveType,
        category: category as CarCategory,
        power: power || '',
        location: location || '',
        image: imagePath,
        plateNumber: plateNumber || '',
        rating: 0,
        reviews: 0,
        isAvailable: true,
        ownerId: decoded.id,  // Critical: Links vehicle to this agent
      },
    });

    // Update agent's total cars count
    await prisma.user.update({
      where: { id: decoded.id },
      data: { totalCars: { increment: 1 } }
    });
    
    return NextResponse.json({
      success: true,
      vehicle,
      message: 'Vehicle added successfully'
    });
    
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}