import { NextRequest } from 'next/server'
import {
  createSupabaseServerClient,
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
  handleDatabaseError
} from '@/lib/api-utils'

// GET /api/analytics/dashboard - Get dashboard analytics
export async function GET(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    
    const supabase = createSupabaseServerClient()
    
    // Get current date information
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0]
    
    // Parallel data fetching for better performance
    const [bookingsResult, callsResult, revenueResult, recentBookingsResult, recentCallsResult] = await Promise.all([
      // Today's bookings count
      supabase
        .from('bookings')
        .select('id', { count: 'exact' })
        .eq('business_id', businessId)
        .eq('appointment_date', todayStr)
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
    if (bookingsResult.error) {
      return handleDatabaseError(bookingsResult.error)
    }
    if (callsResult.error) {
      return handleDatabaseError(callsResult.error)
    }
    if (revenueResult.error) {
      return handleDatabaseError(revenueResult.error)
    }
    if (recentBookingsResult.error) {
      return handleDatabaseError(recentBookingsResult.error)
    }
    if (recentCallsResult.error) {
      return handleDatabaseError(recentCallsResult.error)
    }
    
    // Calculate statistics
    const todayBookings = bookingsResult.count || 0
    const totalCalls = callsResult.count || 0
    const successfulCalls = callsResult.data?.filter(call => call.lead_to_booking)?.length || 0
    const conversionRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0
    
    // Calculate revenue
    const totalRevenue = revenueResult.data?.reduce((sum, booking) => {
      return sum + (booking.total_amount || 0)
    }, 0) || 0
    
    // Get yesterday's bookings for comparison
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    const { data: yesterdayBookings, error: yesterdayError } = await supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .eq('business_id', businessId)
      .eq('appointment_date', yesterdayStr)
      .in('status', ['confirmed', 'completed'])
    
    const yesterdayCount = yesterdayBookings ? (yesterdayError ? 0 : (yesterdayBookings.length || 0)) : 0
    const bookingsTrend = yesterdayCount > 0 ? 
      Math.round(((todayBookings - yesterdayCount) / yesterdayCount) * 100) : 0
    
    return createSuccessResponse({
      stats: {
        todayBookings,
        totalCalls,
        totalRevenue,
        conversionRate: Math.round(conversionRate * 10) / 10, // Round to 1 decimal
        bookingsTrend
      },
      recentBookings: recentBookingsResult.data || [],
      recentCalls: recentCallsResult.data || []
    })
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    console.error('GET /api/analytics/dashboard error:', error)
    return createErrorResponse('Failed to fetch dashboard analytics', 500)
  }
}
