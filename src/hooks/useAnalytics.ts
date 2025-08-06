import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

interface AnalyticsData {
  totalCalls: number
  callsThisWeek: number
  callsLastWeek: number
  totalBookings: number
  bookingsThisWeek: number
  bookingsLastWeek: number
  revenue: number
  conversionRate: number
  avgCallDuration: number
  popularServices: { name: string; bookings: number }[]
  callsByDay: { day: string; calls: number }[]
  bookingsByStatus: { status: string; count: number; color: string }[]
  peakHours: string
  customerSatisfaction: number
}

export function useAnalytics(timeRange: string = '7d') {
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
    queryKey: ['analytics', businessId, timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!businessId) {
        // Return empty data if no business ID
        return getEmptyAnalyticsData()
      }
      
      // Calculate date ranges based on timeRange
      const today = new Date()
      const ranges = getDateRanges(timeRange, today)
      
      // Parallel data fetching for better performance
      const [
        callsThisWeekResult,
        callsLastWeekResult,
        bookingsThisWeekResult,
        bookingsLastWeekResult,
        revenueResult,
        callsByDayResult,
        bookingsByStatusResult,
        popularServicesResult,
        callDurationResult,
        callSatisfactionResult
      ] = await Promise.all([
        // Total calls for this period
        supabase
          .from('call_logs')
          .select('id', { count: 'exact' })
          .eq('business_id', businessId)
          .gte('created_at', ranges.currentPeriodStart)
          .lt('created_at', ranges.currentPeriodEnd),
          
        // Total calls for previous period
        supabase
          .from('call_logs')
          .select('id', { count: 'exact' })
          .eq('business_id', businessId)
          .gte('created_at', ranges.previousPeriodStart)
          .lt('created_at', ranges.previousPeriodEnd),
          
        // Total bookings for this period
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('business_id', businessId)
          .gte('created_at', ranges.currentPeriodStart)
          .lt('created_at', ranges.currentPeriodEnd),
          
        // Total bookings for previous period
        supabase
          .from('bookings')
          .select('id', { count: 'exact' })
          .eq('business_id', businessId)
          .gte('created_at', ranges.previousPeriodStart)
          .lt('created_at', ranges.previousPeriodEnd),
          
        // Revenue calculations for this period
        supabase
          .from('bookings')
          .select('total_amount')
          .eq('business_id', businessId)
          .gte('created_at', ranges.currentPeriodStart)
          .lt('created_at', ranges.currentPeriodEnd)
          .not('total_amount', 'is', null),
          
        // Calls by day for the current period - Count manually by grouping
        supabase
          .from('call_logs')
          .select('created_at')
          .eq('business_id', businessId)
          .gte('created_at', ranges.currentPeriodStart)
          .lt('created_at', ranges.currentPeriodEnd),
          
        // Bookings by status
        supabase
          .from('bookings')
          .select('status')
          .eq('business_id', businessId)
          .gte('created_at', ranges.currentPeriodStart)
          .lt('created_at', ranges.currentPeriodEnd),
          
        // Popular services - Get service_id from bookings, then fetch service names separately
        supabase
          .from('bookings')
          .select('service_id')
          .eq('business_id', businessId)
          .gte('created_at', ranges.currentPeriodStart)
          .lt('created_at', ranges.currentPeriodEnd)
          .not('service_id', 'is', null),
          
        // Average call duration
        supabase
          .from('call_logs')
          .select('call_duration_seconds')
          .eq('business_id', businessId)
          .gte('created_at', ranges.currentPeriodStart)
          .lt('created_at', ranges.currentPeriodEnd)
          .not('call_duration_seconds', 'is', null),
          
        // Customer satisfaction
        supabase
          .from('call_logs')
          .select('customer_satisfaction_score')
          .eq('business_id', businessId)
          .gte('created_at', ranges.currentPeriodStart)
          .lt('created_at', ranges.currentPeriodEnd)
          .not('customer_satisfaction_score', 'is', null)
      ])
      
      // Check for errors and handle
      if (callsThisWeekResult.error) throw callsThisWeekResult.error
      if (callsLastWeekResult.error) throw callsLastWeekResult.error
      if (bookingsThisWeekResult.error) throw bookingsThisWeekResult.error
      if (bookingsLastWeekResult.error) throw bookingsLastWeekResult.error
      if (revenueResult.error) throw revenueResult.error
      if (callsByDayResult.error) throw callsByDayResult.error
      if (bookingsByStatusResult.error) throw bookingsByStatusResult.error
      if (popularServicesResult.error) throw popularServicesResult.error
      if (callDurationResult.error) throw callDurationResult.error
      if (callSatisfactionResult.error) throw callSatisfactionResult.error
      
      // Process the results
      const callsThisWeek = callsThisWeekResult.count || 0
      const callsLastWeek = callsLastWeekResult.count || 0
      const bookingsThisWeek = bookingsThisWeekResult.count || 0
      const bookingsLastWeek = bookingsLastWeekResult.count || 0
      
      // Calculate revenue
      const revenue = revenueResult.data?.reduce((sum, booking) => {
        return sum + (booking.total_amount || 0)
      }, 0) || 0
      
      // Process calls by day data manually from timestamps
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const callsByDay = processCallsByDay(callsByDayResult.data || [], days)
      
      // Process bookings by status
      const statusColors = {
        'confirmed': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      
      const bookingsByStatus = processBookingsByStatus(bookingsByStatusResult.data || [], statusColors)
      
      // Process popular services
      const serviceIds = popularServicesResult.data?.map(booking => booking.service_id) || []
      const uniqueServiceIds = [...new Set(serviceIds)]
      
      // Fetch service names if there are any service IDs
      let popularServices: { name: string; bookings: number }[] = []
      
      if (uniqueServiceIds.length > 0) {
        try {
          const { data: servicesData } = await supabase
            .from('services')
            .select('id, name')
            .in('id', uniqueServiceIds)
          
          // Count bookings per service and create the popular services array
          const serviceCounts: Record<string, number> = {}
          serviceIds.forEach(id => {
            serviceCounts[id] = (serviceCounts[id] || 0) + 1
          })
          
          popularServices = servicesData?.map(service => ({
            name: service.name || 'Unnamed Service',
            bookings: serviceCounts[service.id] || 0
          })) || []
          
          // Sort by booking count and limit to top 4
          popularServices.sort((a, b) => b.bookings - a.bookings)
          popularServices = popularServices.slice(0, 4)
        } catch (error) {
          console.error('Error fetching service details:', error)
          popularServices = []
        }
      }
      
      // Calculate average call duration
      const avgCallDuration = calculateAvgCallDuration(callDurationResult.data || [])
      
      // Calculate conversion rate
      const totalCalls = callsThisWeek
      const conversionRate = totalCalls > 0 ? (bookingsThisWeek / totalCalls) * 100 : 0
      
      // Calculate customer satisfaction
      const customerSatisfaction = calculateCustomerSatisfaction(callSatisfactionResult.data || [])
      
      return {
        totalCalls: callsThisWeek + callsLastWeek,
        callsThisWeek,
        callsLastWeek,
        totalBookings: bookingsThisWeek + bookingsLastWeek,
        bookingsThisWeek,
        bookingsLastWeek,
        revenue,
        conversionRate: Math.round(conversionRate * 10) / 10, // Round to 1 decimal
        avgCallDuration,
        popularServices,
        callsByDay,
        bookingsByStatus,
        peakHours: "2-4 PM", // This would ideally come from analytics
        customerSatisfaction
      }
    },
    enabled: !!businessId,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider stale after 2 minutes
  })
}

// Helper functions

function getDateRanges(timeRange: string, today: Date) {
  let daysToShow = 7
  let currentPeriodStart = new Date(today)
  let previousPeriodStart = new Date(today)
  
  // Set appropriate date ranges based on selected time range
  switch (timeRange) {
    case '7d':
      daysToShow = 7
      currentPeriodStart.setDate(today.getDate() - 7)
      previousPeriodStart.setDate(today.getDate() - 14)
      break
    case '30d':
      daysToShow = 30
      currentPeriodStart.setDate(today.getDate() - 30)
      previousPeriodStart.setDate(today.getDate() - 60)
      break
    case '90d':
      daysToShow = 90
      currentPeriodStart.setDate(today.getDate() - 90)
      previousPeriodStart.setDate(today.getDate() - 180)
      break
  }
  
  // Format dates to ISO string
  const currentPeriodStartStr = currentPeriodStart.toISOString()
  const currentPeriodEndStr = today.toISOString()
  const previousPeriodEndStr = currentPeriodStartStr
  const previousPeriodStartStr = previousPeriodStart.toISOString()
  
  return {
    currentPeriodStart: currentPeriodStartStr,
    currentPeriodEnd: currentPeriodEndStr,
    previousPeriodStart: previousPeriodStartStr,
    previousPeriodEnd: previousPeriodEndStr,
    daysToShow
  }
}

function processCallsByDay(callLogsData: any[], days: string[]) {
  // Initialize with zero calls for each day
  const result = days.map(day => ({ day, calls: 0 }))
  
  // Group calls by day
  callLogsData.forEach(item => {
    const date = new Date(item.created_at)
    const dayIndex = date.getDay() // 0 for Sunday, 1 for Monday, etc.
    result[dayIndex].calls += 1
  })
  
  return result
}

function processBookingsByStatus(bookingsData: any[], statusColors: Record<string, string>) {
  // Count bookings by status
  const statusCounts: Record<string, number> = {}
  
  bookingsData.forEach(booking => {
    const status = booking.status?.toLowerCase() || 'pending'
    statusCounts[status] = (statusCounts[status] || 0) + 1
  })
  
  // Convert to array format needed by the UI
  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize first letter
    count,
    color: statusColors[status] || 'bg-gray-100 text-gray-800'
  }))
}

// This function is no longer needed as we're processing the services data directly
// in the main function after fetching service names separately

function calculateAvgCallDuration(callDurationData: any[]) {
  if (callDurationData.length === 0) return 0
  
  const totalDuration = callDurationData.reduce((sum, call) => {
    return sum + (call.call_duration_seconds || 0)
  }, 0)
  
  return Math.round(totalDuration / callDurationData.length)
}

function calculateCustomerSatisfaction(satisfactionData: any[]) {
  if (satisfactionData.length === 0) return 4.8 // Default value
  
  const totalScore = satisfactionData.reduce((sum, call) => {
    return sum + (call.customer_satisfaction_score || 0)
  }, 0)
  
  return Math.round((totalScore / satisfactionData.length) * 10) / 10
}

function getEmptyAnalyticsData(): AnalyticsData {
  return {
    totalCalls: 0,
    callsThisWeek: 0,
    callsLastWeek: 0,
    totalBookings: 0,
    bookingsThisWeek: 0,
    bookingsLastWeek: 0,
    revenue: 0,
    conversionRate: 0,
    avgCallDuration: 0,
    popularServices: [],
    callsByDay: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({ day, calls: 0 })),
    bookingsByStatus: [
      { status: 'Confirmed', count: 0, color: 'bg-green-100 text-green-800' },
      { status: 'Pending', count: 0, color: 'bg-yellow-100 text-yellow-800' },
      { status: 'Completed', count: 0, color: 'bg-blue-100 text-blue-800' },
      { status: 'Cancelled', count: 0, color: 'bg-red-100 text-red-800' }
    ],
    peakHours: "2-4 PM",
    customerSatisfaction: 4.8
  }
}