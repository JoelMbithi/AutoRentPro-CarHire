// app/features/Admin/Dashboard/api/dashboardService.ts
// This is a CLIENT-SIDE service that calls your API routes

// Define types
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type UserRole = 'CUSTOMER' | 'AGENT' | 'ADMIN';
export type CarCategory = 'ECONOMY' | 'COMPACT' | 'MIDSIZE' | 'STANDARD' | 'FULLSIZE' | 'LUXURY' | 'SUV' | 'SPORTS' | 'MINIVAN';
export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';

export interface DashboardStats {
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  totalCustomers: number;
  totalCars: number;
  availableCars: number;
  customerSatisfaction: number;
  revenueChange: string;
  bookingChange: string;
  customerChange: string;
  totalTransactions: number;
}

export interface RecentBooking {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  customerType: string;
  car: string;
  carImage: string;
  date: string;
  returnDate: string;
  duration: string;
  amount: string;
  status: BookingStatus;
  payment: string;
  pickupLocation: string;
  dropoffLocation: string;
  specialRequests?: string;
  createdAt: Date;
}

export interface FleetVehicle {
  id: number;
  name: string;
  plate: string;
  status: 'available' | 'rented' | 'maintenance';
  rating: number;
  price: string;
  type: CarCategory;
  year?: string;  
  make?: string;  
  model?: string;
  fuel: string;
  location: string;
  nextService: string;
  mileage: string;
  isAvailable: boolean;
  image: string;
  currentRenter: string | null;
}

export interface Customer {
  id: number;
  firstName: string; 
  lastName: string;  
  customerId?: string; 
  name: string;
  email: string;
  phone: string;
  role: string;
  customerType: string;
  isVerified?: boolean; 
  status: 'active' | 'inactive'; 
  bookings?: number; 
  totalSpent?: number; 
  valueScore?: string;
  joinedDate: Date;
  lastBooking?: Date | null;
  userProfile?: any; 
  _count?: {
    bookings: number;
  };
  bookingsArray?: Array<any>; 
}
export interface PaymentRecord {
  id: number;
  paymentId: string;
  customer: string;
  customerEmail: string;
  amount: number;
  date: Date;
  method: string;
  status: PaymentStatus;
  invoice: string;
  transactionId: string;
  receiptNumber?: string;
  car: string;
  bookingDates: string;
  failureReason?: string;
}

export interface RevenueData {
  period: string;
  revenue: number;
  transactions: number;
}

export interface AgentPerformance {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  totalMessages: number;
  repliedMessages: number;
  responseRate: string;
  responseTime: string;
  joined: string;
  specialties: string[];
  languages: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages:number
  };
}

export interface PaymentRecord {
  id: number;
  paymentId: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  date: Date;
  method: string;
  status: PaymentStatus;
  invoice: string;
  transactionId: string;
  receiptNumber?: string;
  car: string;
  bookingDates: string;
  failureReason?: string;
  bookingStatus?: string;
  createdAt: Date;
}

export interface PaymentStats {
  totalRevenue: number;
  pendingPayments: number;
  thisMonthRevenue: number;
  avgTransactionValue: number;
  totalTransactions: number;
  paymentMethods: Array<{
    method: string;
    count: number;
    percentage: string;
    color: string;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

class DashboardService {
  private baseUrl = '/features/Admin/Dashboard/api/dashboard/';

  // Get dashboard statistics
  async getDashboardStats(timeRange: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<DashboardStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      
      // Mock change percentages for now (you can calculate these in your API)
      return {
        ...data,
        revenueChange: '+18.5%',
        bookingChange: '+12.2%',
        customerChange: '+5.7%',
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data if API fails
      return {
        totalRevenue: 42860,
        activeBookings: 28,
        pendingBookings: 9,
        totalCustomers: 1240,
        totalCars: 42,
        availableCars: 18,
        customerSatisfaction: 4.8,
        revenueChange: '+18.5%',
        bookingChange: '+12.2%',
        customerChange: '+5.7%',
        totalTransactions: 156,
        
      };
    }
  }

  // Get recent bookings
  async getRecentBookings(limit: number = 10): Promise<RecentBooking[]> {
    try {
      const response = await fetch(`${this.baseUrl}/bookings?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent bookings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      // Return mock data if API fails
      return [
        { 
          id: '#BK0248', 
          customer: 'Alexander Morgan', 
          customerEmail: 'alex@example.com',
          customerPhone: '+1234567890',
          customerType: 'Premium',
          car: '2024 Mercedes E-Class', 
          carImage: '/cars/mercedes.jpg',
          date: '2024-03-15', 
          returnDate: '2024-03-22',
          duration: '7 days', 
          amount: '$1,890', 
          status: 'ACTIVE',
          payment: 'paid',
          pickupLocation: 'Airport',
          dropoffLocation: 'Downtown',
          specialRequests: 'Extra insurance',
          createdAt: new Date('2024-03-14'),
        },
        { 
          id: '#BK0247', 
          customer: 'Sophia Williams', 
          customerEmail: 'sophia@example.com',
          customerPhone: '+1234567891',
          customerType: 'Regular',
          car: '2023 BMW X5', 
          carImage: '/cars/bmw.jpg',
          date: '2024-03-14', 
          returnDate: '2024-03-17',
          duration: '3 days', 
          amount: '$850', 
          status: 'COMPLETED',
          payment: 'paid',
          pickupLocation: 'Downtown',
          dropoffLocation: 'Airport',
          specialRequests: undefined,
          createdAt: new Date('2024-03-13'),
        },
        { 
          id: '#BK0246', 
          customer: 'James Rodriguez', 
          customerEmail: 'james@example.com',
          customerPhone: '+1234567892',
          customerType: 'Corporate',
          car: '2024 Tesla Model S', 
          carImage: '/cars/tesla.jpg',
          date: '2024-03-14', 
          returnDate: '2024-03-21',
          duration: '7 days', 
          amount: '$2,150', 
          status: 'ACTIVE',
          payment: 'paid',
          pickupLocation: 'City Center',
          dropoffLocation: 'Airport',
          specialRequests: 'Child seat required',
          createdAt: new Date('2024-03-12'),
        },
      ];
    }
  }

  // Get fleet vehicles
 async getFleetVehicles(status?: 'available' | 'rented' | 'maintenance'): Promise<FleetVehicle[]> {
  try {
    console.log(`Fetching fleet vehicles with status: ${status || 'all'}`);
    
    const url = status 
      ? `${this.baseUrl}/fleet?status=${status}`
      : `${this.baseUrl}/fleet`;
    
    console.log(`Fetching from URL: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fleet vehicles: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Received ${data.length} fleet vehicles`);
    
    // Log sample vehicles for debugging
    if (data.length > 0) {
      console.log('Sample fleet vehicles:', data.slice(0, 3).map((v: any) => ({
        id: v.id,
        name: v.name,
        status: v.status,
        plate: v.plate,
        currentRenter: v.currentRenter
      })));
    }
    
    return data.map((vehicle: any) => ({
      id: vehicle.id,
      name: vehicle.name,
      plate: vehicle.plate,
      status: vehicle.status,
      rating: vehicle.rating,
      price: vehicle.price,
      type: vehicle.type,
      fuel: vehicle.fuel,
      location: vehicle.location,
      nextService: vehicle.nextService,
      mileage: vehicle.mileage || '0 km',
      isAvailable: vehicle.isAvailable,
      image: vehicle.image,
      currentRenter: vehicle.currentRenter,
    }));
  } catch (error) {
    console.error('Error fetching fleet vehicles:', error);
    return this.getMockFleet();
  }
}
private getMockFleet(): FleetVehicle[] {
  return [
    { 
      id: 1,
      name: 'Mercedes E-Class 2024', 
      plate: 'CAR-7890',
      status: 'rented' as const, 
      rating: 4.9, 
      price: '$270/day', 
      type: 'LUXURY' as CarCategory,
      fuel: 'PETROL 85%',
      location: 'Downtown',
      nextService: '5000 km',
      mileage: '0 km',
      isAvailable: false,
      image: '/cars/mercedes.jpg',
      currentRenter: 'Alexander Morgan',
    },
    { 
      id: 2,
      name: 'Tesla Model 3 2024', 
      plate: 'TES-4567',
      status: 'available' as const, 
      rating: 4.8, 
      price: '$189/day', 
      type: 'ELECTRIC' as CarCategory,
      fuel: 'Electric 98%',
      location: 'Airport',
      nextService: '2000 km',
      mileage: '0 km',
      isAvailable: true,
      image: '/cars/tesla.jpg',
      currentRenter: null,
    },
    { 
      id: 3,
      name: 'BMW X5 2023', 
      plate: 'BMW-1234',
      status: 'maintenance' as const, 
      rating: 4.7, 
      price: '$220/day', 
      type: 'SUV' as CarCategory,
      fuel: 'DIESEL 65%',
      location: 'Service Center',
      nextService: 'Today',
      mileage: '0 km',
      isAvailable: false,
      image: '/cars/bmw.jpg',
      currentRenter: null,
    },
    
  ];
}


 // Get all customers
async getAllCustomers(
  page: number = 1,
  limit: number = 50,
  filters?: {
    search?: string;
    type?: string;
  }
): Promise<ApiResponse<Customer[]>> {
  try {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    if (filters?.search) params.set('search', filters.search);
    if (filters?.type) params.set('role', filters.type);

    const response = await fetch(`/api/dashboard/customers?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    // Return empty structure if API fails - FIXED: Added totalPages
    return {
      success: false,
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0  // Added this line
      }
    };
  }
}


async deleteCustomer(id: number): Promise<void> {
  const response = await fetch(`/features/Admin/Dashboard/api/dashboard/customers/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete customer');
  }
}


async getCustomerStats(): Promise<{
  totalCustomers: number;
  activeCustomers: number;
  vipMembers: number;
  avgRating: number;
}> {
  const response = await fetch('/features/Admin/Dashboard/api/dashboard/stats');

  if (!response.ok) {
    throw new Error('Failed to fetch customer stats');
  }

  return response.json();
}

  // Get all payments
 async getAllPayments(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ApiResponse<PaymentRecord[]>> {
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      if (filters?.status && filters.status !== 'all') {
        params.set('status', filters.status);
      }
      if (filters?.search) {
        params.set('search', filters.search);
      }
      if (filters?.startDate) {
        params.set('startDate', filters.startDate);
      }
      if (filters?.endDate) {
        params.set('endDate', filters.endDate);
      }

      const response = await fetch(`/api/dashboard/payments?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return {
        success: false,
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0
        }
      };
    }
  }

  // Get payment statistics
  async getPaymentStats(timeRange: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<PaymentStats> {
    try {
      const response = await fetch(`/features/Admin/Dashboard/api/dashboard/payments/stats?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment stats');
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      
      // Return mock data if API fails
      return {
        totalRevenue: 42860,
        pendingPayments: 3150,
        thisMonthRevenue: 12450,
        avgTransactionValue: 1210,
        totalTransactions: 86,
        paymentMethods: [
          { method: 'Credit Card', count: 42, percentage: '58%', color: 'bg-blue-500' },
          { method: 'PayPal', count: 18, percentage: '25%', color: 'bg-blue-400' },
          { method: 'Bank Transfer', count: 9, percentage: '12%', color: 'bg-emerald-500' },
          { method: 'Cash', count: 3, percentage: '5%', color: 'bg-gray-500' },
        ],
        statusDistribution: [
          { status: 'COMPLETED', count: 72, percentage: 84 },
          { status: 'PENDING', count: 8, percentage: 9 },
          { status: 'FAILED', count: 4, percentage: 5 },
          { status: 'CANCELLED', count: 2, percentage: 2 }
        ]
      };
    }
  }

  // Get single payment details
  async getPaymentDetails(id: number) {
    try {
      const response = await fetch(`/api/dashboard/payments/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      return { success: false, error: 'Failed to fetch payment details' };
    }
  }

  // Update payment status
  async updatePaymentStatus(id: number, status: PaymentStatus, notes?: string) {
    try {
      const response = await fetch(`/api/dashboard/payments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return { success: false, error: 'Failed to update payment status' };
    }
  }

  // Process refund
  async processRefund(paymentId: number, amount: number, reason: string) {
    try {
      const response = await fetch(`/api/dashboard/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, reason })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error processing refund:', error);
      return { success: false, error: 'Failed to process refund' };
    }
  }


}

export const dashboardService = new DashboardService();