'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Calendar, Phone, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLayout } from '@/components/ui/layout-context'

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
}

export default function AnalyticsPage() {
  const { setTitle, setSubtitle } = useLayout()

  useEffect(() => {
    setTitle('Analytics');
    setSubtitle('Business performance insights and metrics');
  }, []);

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCalls: 156,
    callsThisWeek: 23,
    callsLastWeek: 18,
    totalBookings: 89,
    bookingsThisWeek: 12,
    bookingsLastWeek: 8,
    revenue: 4250,
    conversionRate: 57.1,
    avgCallDuration: 245,
    popularServices: [
      { name: 'Consultation', bookings: 34 },
      { name: 'Wellness Check', bookings: 28 },
      { name: 'Treatment', bookings: 15 },
      { name: 'Therapy', bookings: 12 }
    ],
    callsByDay: [
      { day: 'Mon', calls: 8 },
      { day: 'Tue', calls: 12 },
      { day: 'Wed', calls: 15 },
      { day: 'Thu', calls: 18 },
      { day: 'Fri', calls: 22 },
      { day: 'Sat', calls: 16 },
      { day: 'Sun', calls: 9 }
    ],
    bookingsByStatus: [
      { status: 'Confirmed', count: 45, color: 'bg-green-100 text-green-800' },
      { status: 'Pending', count: 23, color: 'bg-yellow-100 text-yellow-800' },
      { status: 'Completed', count: 15, color: 'bg-blue-100 text-blue-800' },
      { status: 'Cancelled', count: 6, color: 'bg-red-100 text-red-800' }
    ]
  })
  const [timeRange, setTimeRange] = useState('7d')

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, isPositive: true }
    const percentage = ((current - previous) / previous) * 100
    return { percentage: Math.abs(percentage), isPositive: percentage >= 0 }
  }

  const callsTrend = calculateTrend(analytics.callsThisWeek, analytics.callsLastWeek)
  const bookingsTrend = calculateTrend(analytics.bookingsThisWeek, analytics.bookingsLastWeek)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-end">
        <div className="flex gap-2">
          <Button 
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button 
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button 
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Total Calls
            </CardDescription>
            <CardTitle className="text-2xl">{analytics.totalCalls}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              {callsTrend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={callsTrend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {callsTrend.percentage.toFixed(1)}%
              </span>
              <span className="text-gray-500">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total Bookings
            </CardDescription>
            <CardTitle className="text-2xl">{analytics.totalBookings}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              {bookingsTrend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={bookingsTrend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {bookingsTrend.percentage.toFixed(1)}%
              </span>
              <span className="text-gray-500">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue
            </CardDescription>
            <CardTitle className="text-2xl">${analytics.revenue.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">12.3%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Conversion Rate
            </CardDescription>
            <CardTitle className="text-2xl">{analytics.conversionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">3.2%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calls by Day */}
        <Card className="border py-0 overflow-hidden h-full shadow-none">
          <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 text-sm font-semibold">Calls This Week</CardTitle>
                <CardDescription className="text-gray-500 text-xs">Daily call volume distribution</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.callsByDay.map((data) => {
                const maxCalls = Math.max(...analytics.callsByDay.map(d => d.calls))
                const percentage = (data.calls / maxCalls) * 100
                
                return (
                  <div key={data.day} className="flex items-center gap-3">
                    <div className="w-8 text-sm font-medium text-gray-600">{data.day}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-8 text-sm font-medium text-gray-900">{data.calls}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card className="border py-0 overflow-hidden h-full shadow-none">
          <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 text-sm font-semibold">Booking Status</CardTitle>
                <CardDescription className="text-gray-500 text-xs">Current booking distribution</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.bookingsByStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={status.color}>
                      {status.status}
                    </Badge>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {status.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Services */}
      <Card className="border py-0 overflow-hidden h-full shadow-none">
        <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 text-sm font-semibold">Popular Services</CardTitle>
              <CardDescription className="text-gray-500 text-xs">Most booked services this month</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.popularServices.map((service, index) => {
              const maxBookings = Math.max(...analytics.popularServices.map(s => s.bookings))
              const percentage = (service.bookings / maxBookings) * 100
              
              return (
                <div key={service.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{service.name}</span>
                      <span className="text-sm font-medium text-gray-600">{service.bookings} bookings</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Average Call Duration</CardDescription>
            <CardTitle className="text-2xl">{formatDuration(analytics.avgCallDuration)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Optimal range: 3-5 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Peak Hours</CardDescription>
            <CardTitle className="text-2xl">2-4 PM</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-gray-500">Highest call volume period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Customer Satisfaction</CardDescription>
            <CardTitle className="text-2xl">4.8/5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Based on post-call surveys</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}