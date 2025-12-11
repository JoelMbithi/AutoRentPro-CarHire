import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// Initialize Prisma adapter for PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Seed data with Prisma typing - corrected enum values
const carData: Prisma.CarCreateInput[] = [
  {
    make: "Land Rover", // Added required field
    model: "Range Rover Sport", // Added required field
    year: "2023",
    price: "22,000",
    image: "/range.png", // Changed from 'img' to 'image' to match schema
    fuelType: "DIESEL", // Uppercase to match FuelType enum
    seats: 5,
    transmission: "AUTOMATIC", // Changed from 'gear' to 'transmission', uppercase
    drive: "AWD", // This should match DriveType enum - AWD is valid
    category: "LUXURY", // Uppercase to match CarCategory enum
    rating: 4.8,
    reviews: 92,
    power: "355 HP",
    isAvailable: true, // Changed from 'featured' to 'isAvailable'
    location: "New York", // Added location
  },
  {
    make: "Toyota", // Added required field
    model: "Corolla", // Added required field
    year: "2022",
    price: "15,000",
    image: "/corolla.png", // Changed from 'img' to 'image' to match schema
    fuelType: "PETROL", // Uppercase to match FuelType enum
    seats: 5,
    transmission: "AUTOMATIC", // Changed from 'gear' to 'transmission', uppercase
    drive: "FWD", // This should match DriveType enum - FWD is valid
    category: "ECONOMY", // Uppercase to match CarCategory enum
    rating: 4.5,
    reviews: 140,
    power: "132 HP",
    isAvailable: true, // Changed from 'featured' to 'isAvailable'
    location: "Los Angeles", // Added location
  },
];

export async function main() {
  for (const car of carData) {
    await prisma.car.create({
      data: car,
    });
  }
  console.log("Seed data created!");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());