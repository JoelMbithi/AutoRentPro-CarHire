import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { FuelType, Transmission, DriveType, CarCategory } from '@/app/generated/prisma/enums';

//  Update a vehicle to verify ownership first
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);
    
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Verify ownership - ONLY the owner can update
    const existing = await prisma.car.findFirst({
      where: { 
        id: vehicleId, 
        ownerId: decoded.id
      }
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Vehicle not found or you don't have permission" }, { status: 404 });
    }

    const formData = await request.formData();
    
    const make = formData.get('make') as string;
    const model = formData.get('model') as string;
    const year = formData.get('year') as string;
    const price = formData.get('price') as string;
    const fuelType = formData.get('fuelType') as string;
    const seats = formData.get('seats') as string;
    const transmission = formData.get('transmission') as string;
    const location = formData.get('location') as string;
    const imageFile = formData.get('image') as File | null;
    const plateNumber = formData.get('plateNumber') as string;
    const drive = formData.get('drive') as string;
    const category = formData.get('category') as string;
    const power = formData.get('power') as string;
    const existingImage = formData.get('existingImage') as string;

    let imagePath = existingImage || existing.image;
    
    // Handle new image upload
    if (imageFile && imageFile.size > 0) {
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
        
        // Delete old image if exists
        if (existing.image && existing.image.startsWith('/uploads/')) {
          const oldFilePath = path.join(process.cwd(), 'public', existing.image);
          if (existsSync(oldFilePath)) {
            await unlink(oldFilePath).catch(console.error);
          }
        }
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
      }
    }

    const vehicle = await prisma.car.update({
      where: { id: vehicleId },
      data: {
        make: make || existing.make,
        model: model || existing.model,
        year: year || existing.year,
        price: price ? `KSH ${price}` : existing.price,
        fuelType: (fuelType as FuelType) || existing.fuelType,
        seats: seats ? parseInt(seats) : existing.seats,
        transmission: (transmission as Transmission) || existing.transmission,
        location: location || existing.location,
        image: imagePath,
        plateNumber: plateNumber || existing.plateNumber,
        drive: (drive as DriveType) || existing.drive,
        category: (category as CarCategory) || existing.category,
        power: power || existing.power,
      }
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Remove a vehicle (verify ownership first)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);
    
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Verify ownership - ONLY the owner can delete
    const existing = await prisma.car.findFirst({
      where: { 
        id: vehicleId, 
        ownerId: decoded.id
      }
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Vehicle not found or you don't have permission" }, { status: 404 });
    }

    // Delete image file if exists
    if (existing.image && existing.image.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', existing.image);
      if (existsSync(filePath)) {
        await unlink(filePath).catch(console.error);
      }
    }

    await prisma.car.delete({ where: { id: vehicleId } });

    // Update agent's total cars count
    await prisma.user.update({
      where: { id: decoded.id },
      data: { totalCars: { decrement: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}