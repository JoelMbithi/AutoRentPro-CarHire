// lib/services/carDataService.ts
import prisma from '@/lib/prisma';

export interface CarMakeWithModels {
  make: string;
  models: {
    name: string;
    years: string[];
    count: number;
  }[];
  totalCars: number;
}

export class CarDataService {
  
  // Get all unique makes with their models and years from database
  static async getAllMakes(): Promise<string[]> {
    const makes = await prisma.car.findMany({
      select: { make: true },
      distinct: ['make'],
      orderBy: { make: 'asc' }
    });
    
    return makes.map(m => m.make);
  }

  // Get models for a specific make
  static async getModelsByMake(make: string): Promise<string[]> {
    const models = await prisma.car.findMany({
      where: { make },
      select: { model: true },
      distinct: ['model'],
      orderBy: { model: 'asc' }
    });
    
    return models.map(m => m.model);
  }

  // Get years for a specific make and model
  static async getYearsByMakeAndModel(make: string, model: string): Promise<string[]> {
    const years = await prisma.car.findMany({
      where: { 
        make,
        model 
      },
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' }
    });
    
    return years.map(y => y.year);
  }

  // Get complete car data structure
  static async getCompleteCarData(): Promise<CarMakeWithModels[]> {
    const cars = await prisma.car.findMany({
      select: {
        make: true,
        model: true,
        year: true,
      },
      orderBy: [
        { make: 'asc' },
        { model: 'asc' },
        { year: 'desc' }
      ]
    });

    // Group by make and model
    const makeMap = new Map<string, Map<string, Set<string>>>();
    
    cars.forEach(car => {
      if (!makeMap.has(car.make)) {
        makeMap.set(car.make, new Map());
      }
      
      const modelMap = makeMap.get(car.make)!;
      if (!modelMap.has(car.model)) {
        modelMap.set(car.model, new Set());
      }
      
      modelMap.get(car.model)!.add(car.year);
    });

    // Transform to desired format
    const result: CarMakeWithModels[] = [];
    
    makeMap.forEach((modelMap, make) => {
      const models: { name: string; years: string[]; count: number }[] = [];
      let totalCars = 0;
      
      modelMap.forEach((yearsSet, model) => {
        const years = Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
        models.push({
          name: model,
          years,
          count: years.length
        });
        totalCars += years.length;
      });
      
      result.push({
        make,
        models,
        totalCars
      });
    });

    return result;
  }

  // Get all available years across all cars
  static async getAllYears(): Promise<string[]> {
    const years = await prisma.car.findMany({
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' }
    });
    
    return years.map(y => y.year);
  }

  // Get car count by make
  static async getCarCountByMake(): Promise<Record<string, number>> {
    const cars = await prisma.car.groupBy({
      by: ['make'],
      _count: {
        make: true
      },
      orderBy: {
        make: 'asc'
      }
    });

    const result: Record<string, number> = {};
    cars.forEach(item => {
      result[item.make] = item._count.make;
    });

    return result;
  }

  // Get car count by year
  static async getCarCountByYear(): Promise<Record<string, number>> {
    const cars = await prisma.car.groupBy({
      by: ['year'],
      _count: {
        year: true
      },
      orderBy: {
        year: 'desc'
      }
    });

    const result: Record<string, number> = {};
    cars.forEach(item => {
      result[item.year] = item._count.year;
    });

    return result;
  }

  // Search cars by make, model, or year
  static async searchCars(query: string) {
    return prisma.car.findMany({
      where: {
        OR: [
          { make: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
          { year: { contains: query } }
        ]
      },
      take: 20,
      orderBy: [
        { make: 'asc' },
        { model: 'asc' },
        { year: 'desc' }
      ]
    });
  }
}