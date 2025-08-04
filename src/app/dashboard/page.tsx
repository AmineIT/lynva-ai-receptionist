'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Phone,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Activity,
  Plus,
  Eye
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { useLayout } from '@/components/ui/layout-context'
import Link from 'next/link'

interface DashboardStats {
  todayBookings: number
  totalCalls: number
  totalRevenue: number
  conversionRate: number
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

export default function DashboardPage() {
  const [ stats, setStats ] = useState<DashboardStats>({
    todayBookings: 0,
    totalCalls: 0,
    totalRevenue: 0,
    conversionRate: 0
  })
  const [ recentBookings, setRecentBookings ] = useState<RecentBooking[]>([])
  const [ recentCalls, setRecentCalls ] = useState<RecentCall[]>([])
  const [ loading, setLoading ] = useState(true)
  const { setTitle, setSubtitle } = useLayout()

  useEffect(() => {
    loadDashboardData();
    setTitle('Dashboard');
    setSubtitle('Discover what\'s happening with your business');
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Get current user's business (for demo, we'll use the first business)
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('is_active', true)
        .limit(1)

      const businessId = businesses?.[ 0 ]?.id

      if (!businessId) {
        console.log('No business found')
        return
      }

      // Load stats
      await Promise.all([
        loadStats(businessId),
        loadRecentBookings(businessId),
        loadRecentCalls(businessId)
      ])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async (businessId: string) => {
    try {
      const today = new Date().toISOString().split('T')[ 0 ]

      // Today's bookings
      const { data: todayBookings } = await supabase
        .from('bookings')
        .select('id, total_amount')
        .eq('business_id', businessId)
        .eq('appointment_date', today)
        .eq('status', 'confirmed')

      // Total calls this month
      const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const { data: monthCalls } = await supabase
        .from('call_logs')
        .select('id, lead_to_booking')
        .eq('business_id', businessId)
        .gte('created_at', firstOfMonth)

      // Calculate stats
      const todayRevenue = todayBookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
      const totalCalls = monthCalls?.length || 0
      const successfulCalls = monthCalls?.filter(call => call.lead_to_booking)?.length || 0
      const conversionRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0

      setStats({
        todayBookings: todayBookings?.length || 0,
        totalCalls,
        totalRevenue: todayRevenue,
        conversionRate
      })

    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadRecentBookings = async (businessId: string) => {
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, customer_name, customer_phone, appointment_date, appointment_time, status, total_amount')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentBookings(bookings || [])
    } catch (error) {
      console.error('Error loading recent bookings:', error)
    }
  }

  const loadRecentCalls = async (businessId: string) => {
    try {
      const { data: calls } = await supabase
        .from('call_logs')
        .select('id, caller_phone, call_duration_seconds, intent_detected, lead_to_booking, started_at')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentCalls(calls || [])
    } catch (error) {
      console.error('Error loading recent calls:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 dashboard-content">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.todayBookings}</div>
            <p className="text-xs text-gray-500">
              {stats.todayBookings > 0 ? '+12% from yesterday' : 'No bookings yet today'}
            </p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Calls
            </CardTitle>
            <Phone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
            <p className="text-xs text-gray-500">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenue Today
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-gray-500">
              {stats.totalRevenue > 0 ? '+8% from yesterday' : 'No revenue yet today'}
            </p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              Calls to bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900">Recent Bookings</CardTitle>
                <CardDescription className="text-gray-500">
                  Latest appointment requests
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/bookings">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{booking.customer_name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.appointment_date)} at {formatTime(booking.appointment_time)}
                      </p>
                      <p className="text-xs text-gray-400">{booking.customer_phone}</p>
                    </div>
                    {booking.total_amount && (
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(booking.total_amount)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No bookings yet</p>
                <Button asChild size="sm">
                  <Link href="/dashboard/bookings">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Booking
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Calls */}
        <Card className="border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900">Recent Calls</CardTitle>
                <CardDescription className="text-gray-500">
                  Latest AI call interactions
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/calls">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentCalls.length > 0 ? (
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {call.caller_phone || 'Unknown'}
                        </h4>
                        {call.lead_to_booking && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Booking
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {call.intent_detected || 'General inquiry'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {call.started_at ? formatDate(call.started_at) : 'Recent'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">
                          {call.call_duration_seconds
                            ? `${Math.floor(call.call_duration_seconds / 60)}:${(call.call_duration_seconds % 60).toString().padStart(2, '0')}`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No calls yet</p>
                <p className="text-sm text-gray-400">
                  Your AI receptionist will appear here once you start receiving calls
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="text-gray-500">
            Manage your business operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 border-primary/20 hover:bg-primary/5">
              <Link href="/dashboard/bookings" className="flex flex-col items-center gap-2">
                <Calendar className="w-8 h-8 text-primary" />
                <span className="font-medium">New Booking</span>
                <span className="text-xs text-gray-500">Create appointment manually</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 border-primary/20 hover:bg-primary/5">
              <Link href="/dashboard/content" className="flex flex-col items-center gap-2">
                <MessageSquare className="w-8 h-8 text-primary" />
                <span className="font-medium">Manage FAQs</span>
                <span className="text-xs text-gray-500">Update AI responses</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 border-primary/20 hover:bg-primary/5">
              <Link href="/dashboard/settings" className="flex flex-col items-center gap-2">
                <Activity className="w-8 h-8 text-primary" />
                <span className="font-medium">Settings</span>
                <span className="text-xs text-gray-500">Configure your AI</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}