import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import prisma from '@/lib/prisma';
import { FuelType, Transmission, DriveType, CarCategory } from '@/app/generated/prisma/enums';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);
    
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }

    // First, check if vehicle exists
    const existingVehicle = await prisma.car.findUnique({
      where: { id: vehicleId }
    });

    if (!existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    
    // Get text fields as strings first
    const make = formData.get('make') as string;
    const model = formData.get('model') as string;
    const year = formData.get('year') as string;
    const price = formData.get('price') as string;
    const fuelTypeStr = formData.get('fuelType') as string;
    const seatsStr = formData.get('seats') as string;
    const transmissionStr = formData.get('transmission') as string;
    const driveStr = formData.get('drive') as string;
    const categoryStr = formData.get('category') as string;
    const power = formData.get('power') as string;
    const location = formData.get('location') as string;
    const existingImage = formData.get('existingImage') as string;
    
    // Get new image file if uploaded
    const imageFile = formData.get('image') as File | null;
    
    // Validate required fields
    if (!make || !model || !year || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: make, model, year, price' },
        { status: 400 }
      );
    }

    // Parse seats to integer
    let seats = existingVehicle.seats;
    if (seatsStr && seatsStr.trim() !== '') {
      seats = parseInt(seatsStr);
      if (isNaN(seats)) {
        return NextResponse.json(
          { error: 'Seats must be a valid number' },
          { status: 400 }
        );
      }
    }
    
    // Validate enum values
    let fuelType = existingVehicle.fuelType;
    if (fuelTypeStr && Object.values(FuelType).includes(fuelTypeStr as FuelType)) {
      fuelType = fuelTypeStr as FuelType;
    }
    
    let transmission = existingVehicle.transmission;
    if (transmissionStr && Object.values(Transmission).includes(transmissionStr as Transmission)) {
      transmission = transmissionStr as Transmission;
    }
    
    let drive = existingVehicle.drive;
    if (driveStr && Object.values(DriveType).includes(driveStr as DriveType)) {
      drive = driveStr as DriveType;
    }
    
    let category = existingVehicle.category;
    if (categoryStr && Object.values(CarCategory).includes(categoryStr as CarCategory)) {
      category = categoryStr as CarCategory;
    }
    
    let imagePath = existingImage || existingVehicle.image || '';
    
    // Handle new image upload if present
    if (imageFile && imageFile.size > 0) {
      try {
        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
          return NextResponse.json(
            { error: 'File must be an image' },
            { status: 400 }
          );
        }

        // Validate file size (max 5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'Image size must be less than 5MB' },
            { status: 400 }
          );
        }

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
        
        // Delete old image if it exists
        if (existingVehicle.image && existingVehicle.image.startsWith('/uploads/')) {
          const oldFilePath = path.join(process.cwd(), 'public', existingVehicle.image);
          if (existsSync(oldFilePath)) {
            try {
              await unlink(oldFilePath);
            } catch (err) {
              console.error('Error deleting old image:', err);
              // Continue even if delete fails
            }
          }
        }
        
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
    
    // Update vehicle in database
    const vehicle = await prisma.car.update({
      where: { id: vehicleId },
      data: {
        make,
        model,
        year,
        price,
        fuelType,
        seats,
        transmission,
        drive,
        category,
        power: power || '',
        location: location || '',
        image: imagePath,
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      vehicle,
      message: 'Vehicle updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating vehicle:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update vehicle: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);
    
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }
    
    const vehicle = await prisma.car.findUnique({
      where: { id: vehicleId }
    });
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    // Format the response to match your frontend expectations
    const formattedVehicle = {
      name: `${vehicle.make} ${vehicle.model}`,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      fuel: vehicle.fuelType,
      seats: vehicle.seats,
      gear: vehicle.transmission,
      drive: vehicle.drive,
      type: vehicle.category,
      power: vehicle.power,
      location: vehicle.location,
      img: vehicle.image,
      status: vehicle.isAvailable ? 'available' : 'maintenance',
      plate: `K${vehicle.id.toString().padStart(4, '0')}`,
      rating: vehicle.rating,
    };
    
    return NextResponse.json({ vehicle: formattedVehicle });
    
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);
    
    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }
    
    // Get vehicle to find image path
    const vehicle = await prisma.car.findUnique({
      where: { id: vehicleId }
    });
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    // Delete image file if it exists
    if (vehicle?.image && vehicle.image.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', vehicle.image);
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (err) {
          console.error('Error deleting image:', err);
          // Continue even if image delete fails
        }
      }
    }
    
    // Delete vehicle from database
    await prisma.car.delete({
      where: { id: vehicleId }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Record to delete does not exist')) {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}