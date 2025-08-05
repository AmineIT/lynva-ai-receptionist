import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import type { Booking, CallLog } from '@/lib/supabase'

interface DashboardStats {
  todayBookings: number
  totalCalls: number
  totalRevenue: number
  conversionRate: number
  bookingsTrend: number
}

interface RecentBooking {
  id: string
  customer_name: string
  customer_phone: string
  appointment_date: string
  appointment_time: string
  status: string
  total_amount?: number
}

interface RecentCall {
  id: string
  caller_phone?: string
  call_duration_seconds?: number
  intent_detected?: string
  lead_to_booking: boolean
  started_at?: string
}

interface DashboardData {
  stats: DashboardStats
  recentBookings: RecentBooking[]
  recentCalls: RecentCall[]
}

export function useDashboardAnalytics() {
  const { user } = useAuth()
  
  // Get user's business ID
  const { data: userData } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await supabase
        .from('users')
        .select('business_id')
        .eq('id', user.id)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })
  
  const businessId = userData?.business_id
  
  return useQuery({
    queryKey: ['dashboard-analytics', businessId],
    queryFn: async (): Promise<DashboardData> => {
      if (!businessId) {
        return {
          stats: {
            todayBookings: 0,
            totalCalls: 0,
            totalRevenue: 0,
            conversionRate: 0,
            bookingsTrend: 0
          },
          recentBookings: [],
          recentCalls: []
        }
      }
      
      // Get current date information
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
      
      // Parallel data fetching for better performance
      const [
        todayBookingsResult,
        yesterdayBookingsResult,
        callsResult,
        revenueResult,
        recentBookingsResult,
        recentCallsResult
      ] = await Promise.all([
        // Today's bookings count
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('business_id', businessId)
          .eq('appointment_date', todayStr)
          .in('status', ['confirmed', 'completed']),
        
        // Yesterday's bookings for trend
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('business_id', businessId)
          .eq('appointment_date', yesterdayStr)
          .in('status', ['confirmed', 'completed']),
        
        // This month's calls count
        supabase
          .from('call_logs')
          .select('id, lead_to_booking', { count: 'exact' })
          .eq('business_id', businessId)
          .gte('created_at', firstOfMonth),
        
        // Revenue calculations (this month)
        supabase
          .from('bookings')
          .select('total_amount, currency')
          .eq('business_id', businessId)
          .gte('appointment_date', firstOfMonth)
          .in('status', ['confirmed', 'completed'])
          .not('total_amount', 'is', null),
        
        // Recent bookings (last 5)
        supabase
          .from('bookings')
          .select('id, customer_name, customer_phone, appointment_date, appointment_time, status, total_amount')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent calls (last 5)
        supabase
          .from('call_logs')
          .select('id, caller_phone, call_duration_seconds, intent_detected, lead_to_booking, started_at')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false })
          .limit(5)
      ])
      
      // Check for errors
      if (todayBookingsResult.error) throw todayBookingsResult.error
      if (yesterdayBookingsResult.error) throw yesterdayBookingsResult.error
      if (callsResult.error) throw callsResult.error
      if (revenueResult.error) throw revenueResult.error
      if (recentBookingsResult.error) throw recentBookingsResult.error
      if (recentCallsResult.error) throw recentCallsResult.error
      
      // Calculate statistics
      const todayBookings = todayBookingsResult.count || 0
      const yesterdayBookings = yesterdayBookingsResult.count || 0
      const totalCalls = callsResult.count || 0
      const successfulCalls = callsResult.data?.filter(call => call.lead_to_booking)?.length || 0
      const conversionRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0
      
      // Calculate revenue
      const totalRevenue = revenueResult.data?.reduce((sum, booking) => {
        return sum + (booking.total_amount || 0)
      }, 0) || 0
      
      // Calculate trend
      const bookingsTrend = yesterdayBookings > 0 ? 
        Math.round(((todayBookings - yesterdayBookings) / yesterdayBookings) * 100) : 0
      
      return {
        stats: {
          todayBookings,
          totalCalls,
          totalRevenue,
          conversionRate: Math.round(conversionRate * 10) / 10, // Round to 1 decimal
          bookingsTrend
        },
        recentBookings: recentBookingsResult.data || [],
        recentCalls: recentCallsResult.data || []
      }
    },
    enabled: !!businessId,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider stale after 2 minutes
  })
}
