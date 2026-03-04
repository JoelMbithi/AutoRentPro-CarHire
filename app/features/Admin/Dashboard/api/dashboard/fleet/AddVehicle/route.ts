import { NextRequest, NextResponse } from 'next/server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
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
    
    // Get image file
    const imageFile = formData.get('image') as File | null;
    
    // Validate required fields
    if (!make || !model || !year || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    let imagePath = null;
    
    // Handle image upload if present
    if (imageFile) {
      try {
        // Convert File to Buffer
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create unique filename
        const timestamp = Date.now();
        const originalName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${timestamp}_${originalName}`;
        
        // Define upload path
        const uploadDir = path.join(process.cwd(), 'public/uploads/vehicles');
        const filePath = path.join(uploadDir, filename);
        
        // Create directory if it doesn't exist
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }
        
        // Save file
        await writeFile(filePath, buffer);
        
        // Store relative path for database
        imagePath = `/uploads/vehicles/${filename}`;
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }
    
    // Create vehicle in database
    const vehicle = await prisma.car.create({
      data: {
        make,
        model,
        year,
        price,
        fuelType: fuelType as any,
        seats: seats ? parseInt(seats) : 0,
        transmission: transmission as any,
        drive: drive as any,
        category: category as any,
        power: power || '',
        location: location || '',
        image: imagePath || '',
        rating: 0,
        reviews: 0,
        isAvailable: true,
      },
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

// Optional: GET endpoint to fetch vehicles
export async function GET() {
  try {
    const vehicles = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}