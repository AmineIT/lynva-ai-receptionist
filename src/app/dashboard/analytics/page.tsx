'use client'

import { useEffect, useState } from 'react'
import { useLayout } from '@/components/providers/layout-provider'
import { useAnalytics } from '@/hooks/useAnalytics'
import AnalyticsHeader from '@/components/analytics/analytics-header'
import StatsCards from '@/components/analytics/stats-cards'
import ChartsRow from '@/components/analytics/charts-row'
import PopularServices from '@/components/analytics/popular-services'
import AdditionalMetrics from '@/components/analytics/additional-metrics'

export default function AnalyticsPage() {
  const { setTitle, setSubtitle } = useLayout()
  const [timeRange, setTimeRange] = useState('7d')
  
  // Use the new analytics hook
  const { data: analyticsData } = useAnalytics(timeRange)

  useEffect(() => {
    setTitle('Analytics');
    setSubtitle('Business performance insights and metrics');
  }, []);

  // Use the data from the hook, or fall back to empty values if loading
  const analytics = analyticsData || {
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
    callsByDay: [],
    bookingsByStatus: [],
    peakHours: '',
    customerSatisfaction: 0
  }

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, isPositive: true }
    const percentage = ((current - previous) / previous) * 100
    return { percentage: Math.abs(percentage), isPositive: percentage >= 0 }
  }

  const callsTrend = calculateTrend(analytics.callsThisWeek, analytics.callsLastWeek)
  const bookingsTrend = calculateTrend(analytics.bookingsThisWeek, analytics.bookingsLastWeek)

  return (
    <div className="space-y-6">
      <AnalyticsHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      <StatsCards analytics={analytics} callsTrend={callsTrend} bookingsTrend={bookingsTrend} />
      <ChartsRow analytics={analytics} />
      <PopularServices analytics={analytics} />
      <AdditionalMetrics analytics={analytics} />
    </div>
  )
}