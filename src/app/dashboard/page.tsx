'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Calendar,
  Phone,
  MessageSquare,
  TrendingUp,
  Clock,
  DollarSign,
  Activity,
  Plus,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { useLayout } from '@/components/ui/layout-context'
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics'
import Link from 'next/link'
import { useUserProfile } from '@/hooks/useUserProfile'
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton'

export default function DashboardPage() {
  const { setTitle, setSubtitle } = useLayout()
  const { isLoading: isLoadingUserProfile } = useUserProfile({ enableRedirect: false })
  const { data: dashboardData, isLoading: loading, error, refetch } = useDashboardAnalytics()

  useEffect(() => {
    setTitle('Dashboard');
    setSubtitle('Discover what\'s happening with your business');
  }, []);

  if (loading || isLoadingUserProfile) {
    return (
      <DashboardSkeleton />
    )
  }

  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Failed to load dashboard</h3>
          <p className="text-gray-500 mt-2">{error?.message || 'Unable to load dashboard data'}</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  const stats = dashboardData?.stats || {
    todayBookings: 0,
    bookingsTrend: 0,
    totalCalls: 0,
    totalRevenue: 0,
    conversionRate: 0
  }
  const recentBookings = dashboardData?.recentBookings || []
  const recentCalls = dashboardData?.recentCalls || []

  return (
    <div className="space-y-6 dashboard-content">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.todayBookings}</div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {stats.bookingsTrend !== 0 && (
                stats.bookingsTrend > 0 ? (
                  <><ArrowUp className="w-3 h-3 text-green-500" /> +{stats.bookingsTrend}% from yesterday</>
                ) : (
                  <><ArrowDown className="w-3 h-3 text-red-500" /> {stats.bookingsTrend}% from yesterday</>
                )
              )}
              {stats.bookingsTrend === 0 && 'Same as yesterday'}
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
              {stats.totalRevenue > 0 ? 'This month' : 'No revenue this month'}
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
        <Card className="border py-0 overflow-hidden">
          <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 text-sm font-semibold">Recent Bookings ({recentBookings.length})</CardTitle>
                <CardDescription className="text-gray-500 text-xs">
                  Latest appointment requests
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                {recentBookings.length > 0 && (
                  <Link href="/dashboard/bookings">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Link>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.slice(0, 3).map((booking) => (
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
                <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 text-sm font-semibold">No bookings yet</p>
                <p className="text-gray-400 text-xs">
                  Your bookings will appear here once you start receiving them
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Calls */}
        <Card className="border py-0 overflow-hidden">
          <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 text-sm font-semibold">Recent Calls ({recentCalls.length})</CardTitle>
                <CardDescription className="text-gray-500 text-xs">
                  Latest AI call interactions
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                {recentCalls.length > 0 && (
                  <Link href="/dashboard/calls">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Link>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentCalls.length > 0 ? (
              <div className="space-y-4">
                {recentCalls.slice(0, 3).map((call) => (
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
                <Phone className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 text-sm font-semibold">No calls yet</p>
                <p className="text-gray-400 text-xs">
                  Your AI receptionist will appear here once you start receiving calls
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border">
        <CardHeader className="gap-0">
          <CardTitle className="text-gray-900 text-sm font-semibold">Quick Actions</CardTitle>
          <CardDescription className="text-gray-500 text-xs">
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