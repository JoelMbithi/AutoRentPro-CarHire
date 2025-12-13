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

async function main() {
  const agents = [
    {
      name: ' Kelvin Odhiambo',
      role: 'Senior Car Hire Agent',
      rating: 4.9,
      reviews: 127,
      image: '/Profiles/Agent1.png',
      phone: '+254 712 345 678',
      email: 'kevin@autorentpro.com',
      location: 'Kisumu, Kenya',
      bio: 'Over 6 years of experience in vehicle rentals, customer service, and corporate bookings.',
      specialties: ['Luxury Vehicles', 'Corporate Accounts', 'Long-term Rentals'],
      languages: ['English', 'Swahili','Luo'],
      responseTime: 'Under 15 minutes',
      joined: '2025'
    },
    {
      name: 'Christine Mutheu',
      role: 'Customer Support Specialist',
      rating: 4.8,
      reviews: 89,
      image: '/Profiles/agent2.jpeg',
      phone: '+254 743 264 773',
      email: 'tianahtish@gmail.com',
      location: 'Mombasa, Kenya',
      bio: 'Dedicated to ensuring customer satisfaction with quick and reliable assistance.',
      specialties: ['Family Vehicles', 'Airport Pickups', 'Tourist Packages'],
      languages: ['English', 'Swahili', 'French'],
      responseTime: 'Under 10 minutes',
      joined: '2025'
    },
    {
      name: 'Joel Mbithi',
      role: 'Fleet Manager',
      rating: 5.0,
      reviews: 156,
      image: '/Profiles/agent3.png',
      phone: '+254 743 861 565',
      email: 'joel@autorentpro.com',
      location: 'Chuka, Kenya',
      bio: 'Expert in vehicle inspection, maintenance, and AutoRent Pro car rental advisory.',
      specialties: ['4WD & Safari Vehicles', 'Fleet Management', 'Vehicle Inspection'],
      languages: ['English', 'Swahili', 'Kamba'],
      responseTime: 'Under 20 minutes',
      joined: '2025'
    }
  ];

  for (const agent of agents) {
    await prisma.agent.create({
      data: agent
    });
  }

  console.log(' Agents seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
