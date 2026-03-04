import { TimeRange } from "@/app/features/car-listing/types";

export interface RevenueSummary {
  total: number;
  previousTotal: number;
  change: string;
  count: number;
}

export interface PaymentMethod {
  method: string;
  count: number;
  percentage: string;
  color?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  pendingPayments: number;
  thisMonthRevenue: number;
  avgTransactionValue: number;
  totalTransactions: number;
  paymentMethods: PaymentMethod[];
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

export const paymentService = {
  // Get total revenue from completed payments
  async getTotalRevenue(timeRange?: TimeRange): Promise<number> {
    try {
      const params = new URLSearchParams();
      
      if (timeRange) {
        const dates = getDateRangeFromTimeRange(timeRange);
        if (dates.startDate) params.append('startDate', dates.startDate.toISOString());
        if (dates.endDate) params.append('endDate', dates.endDate.toISOString());
      }
      
      params.append('status', 'COMPLETED');
      
      const response = await fetch(`/api/dashboard/payments?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data.reduce((sum: number, payment: any) => sum + payment.amount, 0);
      }
      return 0;
    } catch (error) {
      console.error('Error fetching total revenue:', error);
      return 0;
    }
  },

  // Get revenue summary with previous period comparison
  async getRevenueSummary(timeRange: TimeRange = 'month'): Promise<RevenueSummary> {
    try {
      const params = new URLSearchParams();
      const dates = getDateRangeFromTimeRange(timeRange);
      
      // Current period
      if (dates.startDate) params.append('startDate', dates.startDate.toISOString());
      if (dates.endDate) params.append('endDate', dates.endDate.toISOString());
      params.append('status', 'COMPLETED');
      
      const currentResponse = await fetch(`/api/dashboard/payments?${params.toString()}`);
      const currentData = await currentResponse.json();
      
      // Previous period for comparison
      const previousDates = getPreviousPeriodDates(timeRange);
      const prevParams = new URLSearchParams();
      if (previousDates.startDate) prevParams.append('startDate', previousDates.startDate.toISOString());
      if (previousDates.endDate) prevParams.append('endDate', previousDates.endDate.toISOString());
      prevParams.append('status', 'COMPLETED');
      
      const previousResponse = await fetch(`/api/dashboard/payments?${prevParams.toString()}`);
      const previousData = await previousResponse.json();
      
      const currentTotal = currentData.data?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
      const previousTotal = previousData.data?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
      
      // Calculate percentage change
      let change = '0%';
      if (previousTotal > 0) {
        const changeValue = ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1);
        change = `${parseFloat(changeValue) > 0 ? '+' : ''}${changeValue}%`;
      } else if (currentTotal > 0) {
        change = '+100%';
      }
      
      return {
        total: currentTotal,
        previousTotal,
        change,
        count: currentData.data?.length || 0
      };
      
    } catch (error) {
      console.error('Error fetching revenue summary:', error);
      return { total: 0, previousTotal: 0, change: '0%', count: 0 };
    }
  },

  // Get payments list with filters
  async getPayments(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    method?: string;
  } = {}) {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.status) searchParams.append('status', params.status);
      if (params.search) searchParams.append('search', params.search);
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);
      if (params.method) searchParams.append('method', params.method);
      
      const response = await fetch(`/api/dashboard/payments?${searchParams.toString()}`);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return { success: false, data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    }
  },

  // Get payment statistics
  async getPaymentStats(timeRange: TimeRange = 'month'): Promise<PaymentStats> {
    try {
      const response = await fetch(`/features/Admin/Dashboard/api/dashboard/stats?timeRange=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
      
      // Return default stats if API fails
      return {
        totalRevenue: 0,
        pendingPayments: 0,
        thisMonthRevenue: 0,
        avgTransactionValue: 0,
        totalTransactions: 0,
        paymentMethods: [],
        statusDistribution: []
      };
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      return {
        totalRevenue: 0,
        pendingPayments: 0,
        thisMonthRevenue: 0,
        avgTransactionValue: 0,
        totalTransactions: 0,
        paymentMethods: [],
        statusDistribution: []
      };
    }
  }
};

// Helper function to get date range from timeRange
function getDateRangeFromTimeRange(timeRange: TimeRange): { startDate: Date | null; endDate: Date | null } {
  const now = new Date();
  const startDate = new Date();
  
  switch (timeRange) {
    case 'day':  // ✅ FIXED: Changed from 'today' to 'day'
      startDate.setHours(0, 0, 0, 0);
      return { startDate, endDate: now };
    case 'week':
      startDate.setDate(now.getDate() - 7);
      return { startDate, endDate: now };
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      return { startDate, endDate: now };
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      return { startDate, endDate: now };
    default:
      return { startDate: null, endDate: null };
  }
}

function getPreviousPeriodDates(timeRange: TimeRange): { startDate: Date | null; endDate: Date | null } {
  const now = new Date();
  const { startDate, endDate } = getDateRangeFromTimeRange(timeRange);
  
  if (!startDate || !endDate) return { startDate: null, endDate: null };
  
  const periodLength = endDate.getTime() - startDate.getTime();
  const previousEndDate = new Date(startDate.getTime() - 1);
  const previousStartDate = new Date(previousEndDate.getTime() - periodLength);
  
  return { startDate: previousStartDate, endDate: previousEndDate };
}