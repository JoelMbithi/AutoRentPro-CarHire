import { JsonNullableFilter } from "@/app/generated/prisma/commonInputTypes";
import { CarCategory, DriveType, FuelType, Transmission } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";




export async  function POST (request:NextRequest){
    try {
        /* Creating a car */
        const body = await request.json()

        /* Validate reuired fieds */
        const requiredFields = ['make', 'model', 'year', 'price', 'image', 'fuelType', 'seats', 'transmission', 'drive', 'category'];

        const missingFields = requiredFields.filter(field => !body[field] )

        if (missingFields.length > 0){
            return NextResponse.json(
                {error:"Missing Fields:${missingFields.join(',')"},
                {status: 400}
            )
        }

        // validation enum values
        const validCategories = Object.values(CarCategory)
        const validFuelTypes = Object.values(FuelType)
        const validTransmission = Object.values(Transmission)
        const validDriveTypes = Object.values(DriveType)

        if(!validCategories.includes(body.category)){
            return NextResponse.json(
                {error : "Invalide Category. Must be one of these: ${validecategories.join(',')"},
                {status: 400}
            )
        }

        if(!validDriveTypes.includes(body.drive)){
            return NextResponse.json(
                { error : "Invalide drive.Must be one of these: ${valideDriveTypes.join(',')"},
                {status: 400}

            )
        }

        /* create car in database */
         const car = await prisma.car.create({
      data: {
        make: body.make,
        model: body.model,
        year: body.year,
        price: body.price,
        image: body.image,
        fuelType: body.fuelType,
        seats: parseInt(body.seats),
        transmission: body.transmission,
        drive: body.drive,
        category: body.category,
        rating: body.rating ? parseFloat(body.rating) : 0,
        reviews: body.reviews ? parseInt(body.reviews) : 0,
        power: body.power || "",
        isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
        location: body.location || null,
      },
    });

    return NextResponse.json(
        {message: "Car created succefully", car},
        {status: 201}
    )
    } catch (error) {
        console.error("Error when creating a car",error);
         return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    }

   


}



/* Getting  a car */

export default async function (request:NextRequest){
      try {
        const { searchParams} = new URL(request.url)
        /* extract query para,eters */
        const category = searchParams.get('category')as CarCategory | null;
        const fuelType = searchParams.get('fuelType') as FuelType | null;
        const transmission = searchParams.get('transmission') as Transmission | null;
        const drive = searchParams.get('drive') as DriveType | null;
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const seats = searchParams.get('seats');
        const search = searchParams.get('search');
        const availableOnly = searchParams.get('availableOnly') === 'true';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        /* Clause for Filtering */
        const where:any = {}

        if (category) where.category = category;
        if(fuelType) where.fuelType = fuelType;
        if(transmission) where.transmission = transmission
        if (drive) where.drive = drive;
        if (seats) where.seats = parseInt(seats);
        if (availableOnly) where.isAvailable = true;

         // Search across make and model
    if (search) {
      where.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          price: true,
          image: true,
          fuelType: true,
          seats: true,
          transmission: true,
          drive: true,
          category: true,
          rating: true,
          reviews: true,
          power: true,
          isAvailable: true,
          location: true,
          createdAt: true,
        },
      }),
      prisma.car.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: cars,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext,
        hasPrev,
      },
    });

      } catch (error) {
           console.error("Error fetching cars:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch cars" 
      },
      { status: 500 }
    );
  
      }
}

/* get single car */
export async function GET (request:NextRequest,
    { params} : { params: {id: string}}
){
      try {
        const id = parseInt(params.id);

        if(isNaN(id)){
            return NextResponse.json(
                 { error: "Invalid car ID" },
        { status: 400 }
            )
        }
        const car = await prisma.car.findUnique({
            where: {id},
            include: {
                bookings: {
                    select:{
                        id: true,
                          startDate: true,
                            endDate: true,
                            status: true,
                    },
                     where: {
            status: {
              in: ['CONFIRMED', 'ACTIVE']
            }
        }
                }
            }
        })

         if (!car) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: car,
    });

      } catch (error) {
         console.error("Error fetching car:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch car" 
      },
      { status: 500 }
    );
  
      }
}



/* featured cars  */

