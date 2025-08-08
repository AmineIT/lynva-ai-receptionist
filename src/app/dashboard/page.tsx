'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useLayout } from '@/components/providers/layout-provider'
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics'
import { useUserProfile } from '@/hooks/useUserProfile'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import StatsCards from '@/components/dashboard/stats-cards'
import RecentActivities from '@/components/dashboard/recent-activities'
import QuickActions from '@/components/dashboard/quick-actions'

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
      <StatsCards stats={stats} />

      {/* Recent Activity */}
      <RecentActivities recentBookings={recentBookings} recentCalls={recentCalls} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}