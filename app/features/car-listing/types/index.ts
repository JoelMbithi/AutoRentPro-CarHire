import { LucideIcon } from 'lucide-react';

export interface CarProps {
  id: number;
  name: string;
  img: string;
  fuelType: string;
  seats: number;
  gear: string;
  drive: string;
  price: number | string;
  power: string;
  year: string;
  featured: boolean;
  category: string;
  location?: string;
}

export interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  detail: string;
  trend: 'up' | 'down';
}

export type BookingStatus = 'active' | 'pending' | 'completed' | 'upcoming';
export type CustomerType = 'VIP' | 'Premium' | 'Corporate' | 'Regular' | 'New';
export type PaymentStatus = 'paid' | 'deposit' | 'unpaid';
export type PriorityLevel = 'high' | 'normal';

export interface Booking {
  id: string;
  customer: string;
  customerType: CustomerType;
  car: string;
  date: string;
  returnDate: string;
  duration: string; // Make this required
  amount: string;
  status: BookingStatus;
  payment?: PaymentStatus;
  priority?: PriorityLevel;
}

export type FleetStatus = 'available' | 'rented' | 'maintenance';

export interface FleetVehicle {
    id: number;
  name: string;
  plate: string;
  status: 'available' | 'rented' | 'maintenance';
  year: string;
  make: string;
  model: string;
  rating: number;
  seats: number;
  price: string;
  type: string;
  fuel: string;
  location: string;
  nextService: string;
  image: string;
  currentRenter?: string | null;
}

export interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  count: string | null;
  badge: string | null;
}

export type TimeRange = 'day' | 'week' | 'month' | 'year';
export type FilterType = 'all' | 'active' | 'pending' | 'completed';