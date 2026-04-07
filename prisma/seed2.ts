// prisma/seed2.ts
import { PrismaClient, Prisma, FuelType, Transmission, DriveType } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// Initialize Prisma adapter for PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

// Define all available categories from your enum
const categories = [
  "ECONOMY",
  "COMPACT",
  "MIDSIZE",
  "STANDARD",
  "FULLSIZE",
  "LUXURY",
  "SUV",
  "SPORTS",
  "MINIVAN"
] as const;

type Category = typeof categories[number];

// Real image URLs from Unsplash that match car categories
const imageUrls: Record<Category, string[]> = {
  ECONOMY: [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format',
    'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800&auto=format',
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&auto=format',
    'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&auto=format',
    'https://images.unsplash.com/photo-1748214547184-d994bfe53322?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fENvbXBhY3QlMjBjYXJ8ZW58MHx8MHx8fDA%3D',
  ],
  COMPACT: [
    'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&auto=format',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format',
    'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&auto=format',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format',
    'https://images.unsplash.com/photo-1683444112252-41c5ddf73815?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
  MIDSIZE: [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format',
    'https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?q=80&w=1100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&auto=format',
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&auto=format',
    'https://images.unsplash.com/photo-1635011747404-2b306059ebd7?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
  STANDARD: [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format',
    'https://images.unsplash.com/photo-1769641156712-7a8044d19c3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D',
    'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&auto=format',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format',
    'https://images.unsplash.com/photo-1754471174399-7ffa6ac4e80e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D',
  ],
  FULLSIZE: [
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format',
    'https://images.unsplash.com/photo-1604430096113-f3806ab7c810?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1616452862884-f170c90ddb03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1731988666949-06e7d359c67a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI5fHx8ZW58MHx8fHx8',
  ],
  LUXURY: [
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format',
    'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800&auto=format',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVyY2VkZXN8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1659671026913-b7e632f17395?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D',
  ],
  SUV: [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format',
    'https://images.unsplash.com/photo-1656597699338-e1076e8187ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format',
    'https://plus.unsplash.com/premium_photo-1698183570653-e0516696bd48?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&auto=format',
    'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmlzc2FufGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1602038187784-41e649a79d38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8SmVlcHxlbnwwfHwwfHx8MA%3D%3D',
  ],
  SPORTS: [
    'https://images.unsplash.com/photo-1551727324-355cda9f1884?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFNQT1JUJTIwQ0FSfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1612593968469-d44a2e6ab5d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFNQT1JUJTIwQ0FSfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1616804087673-cdcd32e5578f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3ViYXJ1fGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format',
    'https://images.unsplash.com/photo-1636962080905-6c7855f999c5?q=80&w=1456&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
  MINIVAN: [
    'https://plus.unsplash.com/premium_photo-1664358190451-e7ca9d068210?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&auto=format',
    'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&auto=format',
    'https://images.unsplash.com/photo-1609521263047-f8f205293f84?w=800&auto=format',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format',
  ],
};

// Sample data for generating realistic car information
const makes: Record<Category, string[]> = {
  ECONOMY: ['Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan'],
  COMPACT: ['Honda', 'Mazda', 'Ford', 'Volkswagen', 'Chevrolet'],
  MIDSIZE: ['Toyota', 'Honda', 'Mazda', 'Volkswagen', 'Nissan'],
  STANDARD: ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan'],
  FULLSIZE: ['Toyota', 'Ford', 'Chevrolet', 'Dodge', 'Chrysler'],
  LUXURY: ['Mercedes-Benz', 'BMW', 'Audi', 'Lexus', 'Porsche'],
  SUV: ['Toyota', 'Honda', 'Ford', 'Jeep', 'Chevrolet', 'Land Rover'],
  SPORTS: ['Porsche', 'Chevrolet', 'Ford', 'Nissan', 'BMW'],
  MINIVAN: ['Toyota', 'Honda', 'Chrysler', 'Kia', 'Ford'],
};

const models: Record<string, string[]> = {
  'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius', 'Yaris', 'Avalon', 'Sienna'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'Odyssey'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona'],
  'Kia': ['Rio', 'Forte', 'K5', 'Soul', 'Sportage', 'Sorento', 'Carnival'],
  'Nissan': ['Versa', 'Sentra', 'Altima', 'Maxima', 'Rogue', 'Pathfinder'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5'],
  'Ford': ['Fiesta', 'Focus', 'Fusion', 'Mustang', 'Escape', 'Explorer'],
  'Chevrolet': ['Spark', 'Cruze', 'Malibu', 'Impala', 'Camaro', 'Equinox', 'Traverse'],
  'Volkswagen': ['Jetta', 'Passat', 'Golf', 'Tiguan', 'Atlas'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'Z4'],
  'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  'Lexus': ['ES', 'IS', 'RX', 'NX', 'GX'],
  'Porsche': ['718', '911', 'Cayenne', 'Macan', 'Panamera'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Compass', 'Renegade'],
  'Land Rover': ['Range Rover', 'Discovery', 'Evoque', 'Velar'],
  'Dodge': ['Charger', 'Challenger', 'Durango'],
  'Chrysler': ['300', 'Pacifica'],
};

// Helper functions
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getPriceByCategory = (category: Category): string => {
  const priceRanges: Record<Category, [number, number]> = {
    ECONOMY: [45, 75],
    COMPACT: [55, 85],
    MIDSIZE: [65, 95],
    STANDARD: [70, 100],
    FULLSIZE: [80, 120],
    LUXURY: [150, 350],
    SUV: [90, 200],
    SPORTS: [180, 400],
    MINIVAN: [100, 180],
  };

  const [min, max] = priceRanges[category];
  return getRandomNumber(min, max).toString();
};

const getRandomRating = (): number => {
  return Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
};

const getRandomReviews = (): number => {
  return getRandomNumber(50, 500);
};

const getSeatsByCategory = (category: Category): number => {
  const seatMap: Record<Category, number[]> = {
    ECONOMY: [4, 5],
    COMPACT: [4, 5],
    MIDSIZE: [5],
    STANDARD: [5],
    FULLSIZE: [5],
    LUXURY: [4, 5],
    SUV: [5, 7],
    SPORTS: [2, 4],
    MINIVAN: [7, 8],
  };

  return getRandomItem(seatMap[category]);
};

const getPowerByCategory = (category: Category): string => {
  const powerRanges: Record<Category, string[]> = {
    ECONOMY: ['100-120 hp', '120-140 hp'],
    COMPACT: ['120-140 hp', '140-160 hp'],
    MIDSIZE: ['150-180 hp', '180-200 hp'],
    STANDARD: ['160-190 hp', '190-210 hp'],
    FULLSIZE: ['180-220 hp', '220-250 hp'],
    LUXURY: ['250-300 hp', '300-400 hp', '400+ hp'],
    SUV: ['200-250 hp', '250-300 hp', '300-350 hp'],
    SPORTS: ['300-400 hp', '400-500 hp', '500+ hp'],
    MINIVAN: ['180-220 hp', '220-260 hp'],
  };

  return getRandomItem(powerRanges[category]);
};

// Fixed: These functions now return the actual enum types
const getDriveType = (category: Category): DriveType => {
  const driveOptions: Record<Category, DriveType[]> = {
    ECONOMY: [DriveType.FWD, DriveType.FWD, DriveType.FWD],
    COMPACT: [DriveType.FWD, DriveType.FWD, DriveType.FWD],
    MIDSIZE: [DriveType.FWD, DriveType.FWD, DriveType.AWD],
    STANDARD: [DriveType.FWD, DriveType.AWD],
    FULLSIZE: [DriveType.FWD, DriveType.AWD, DriveType.RWD],
    LUXURY: [DriveType.AWD, DriveType.RWD, DriveType.AWD],
    SUV: [DriveType.FWD, DriveType.AWD, DriveType.FOUR_WD],
    SPORTS: [DriveType.RWD, DriveType.AWD, DriveType.RWD],
    MINIVAN: [DriveType.FWD, DriveType.FWD, DriveType.AWD],
  };

  return getRandomItem(driveOptions[category]);
};

const getFuelType = (): FuelType => {
  return getRandomItem([FuelType.PETROL, FuelType.DIESEL, FuelType.HYBRID, FuelType.ELECTRIC]);
};

const getTransmission = (): Transmission => {
  return getRandomItem([Transmission.AUTOMATIC, Transmission.AUTOMATIC, Transmission.MANUAL]);
};

const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi'];

async function clearDatabase() {
  console.log('🧹 Clearing database in correct order...');

  // Delete in order of dependencies (child tables first)
  console.log('  - Deleting payments...');
  await prisma.payment.deleteMany({});

  console.log('  - Deleting bookings...');
  await prisma.booking.deleteMany({});

  console.log('  - Deleting cars...');
  await prisma.car.deleteMany({});

  console.log(' Database cleared successfully');
}

async function seedCars() {
  console.log('🌱 Starting car seeding with real images...');

  try {
    // Get an admin user to set as manager
    const admin = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'SUPER_ADMIN' }
        ]
      }
    });

    if (!admin) {
      console.log('⚠️ No admin found. Cars will be created without a manager.');
    }

    // Clear existing data in correct order
    await clearDatabase();

    // Calculate cars per category (60 cars across 9 categories = ~6-7 per category)
    const carsPerCategory = Math.floor(60 / categories.length);
    const remainingCars = 60 - (carsPerCategory * categories.length);

    console.log(` Will create ${carsPerCategory} cars per category, with ${remainingCars} extra distributed`);

    const carDataArray: Prisma.CarCreateInput[] = [];

    // Generate cars for each category
    for (const category of categories) {
      // Determine how many cars to create for this category
      let countForCategory = carsPerCategory;
      if (remainingCars > 0 && categories.indexOf(category) < remainingCars) {
        countForCategory++;
      }

      console.log(`Generating ${countForCategory} ${category} cars...`);

      // Get images for this category
      const categoryImages = imageUrls[category];

      // Generate the specified number of cars for this category
      for (let i = 0; i < countForCategory; i++) {
        const make = getRandomItem(makes[category]);
        const model = getRandomItem(models[make] || ['Unknown']);
        const year = getRandomNumber(2020, 2024).toString();
        const price = getPriceByCategory(category);
        const image = getRandomItem(categoryImages);

        const carData: Prisma.CarCreateInput = {
          make,
          model,
          year,
          price,
          image,
          fuelType: getFuelType(),
          seats: getSeatsByCategory(category),
          transmission: getTransmission(),
          drive: getDriveType(category),
          category,
          rating: getRandomRating(),
          reviews: getRandomReviews(),
          power: getPowerByCategory(category),
          isAvailable: true,
          location: getRandomItem(locations),
          //managedBy: admin ? { connect: { id: admin.id } } : undefined,
        };

        carDataArray.push(carData);
      }
    }

    // Create all cars
    console.log(`\n💾 Creating ${carDataArray.length} cars in database...`);

    let createdCount = 0;
    for (const carData of carDataArray) {
      await prisma.car.create({
        data: carData,
      });
      createdCount++;

      if (createdCount % 10 === 0) {
        console.log(`   Created ${createdCount} cars...`);
      }
    }

    console.log(`\n🎉 Successfully created ${createdCount} cars with real images!`);

    // Print summary by category
    const summary = await Promise.all(categories.map(async (category) => {
      const count = await prisma.car.count({
        where: { category: category as any }
      });
      return `${category}: ${count} cars`;
    }));

    console.log('\n📈 Summary by category:');
    summary.forEach(line => console.log(`  ${line}`));

    // Show a sample of the created cars
    const sampleCars = await prisma.car.findMany({
      take: 5,
      orderBy: { id: 'desc' }
    });

    console.log('\n🚗 Sample of created cars:');
    sampleCars.forEach(car => {
      console.log(`  - ${car.make} ${car.model} (${car.year}): ${car.category} - $${car.price}/day`);
    });

  } catch (error) {
    console.error('❌ Error seeding cars:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedCars()
  .then(() => {
    console.log('✨ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });