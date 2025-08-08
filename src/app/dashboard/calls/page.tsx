'use client'

import { useEffect } from 'react'
import { useLayout } from '@/components/providers/layout-provider'
import { CallsSkeleton } from '@/components/calls/calls-skeleton'
import { useCallLogs } from '@/hooks/useCallLogs'
import StatsCards from '@/components/calls/stats-cards'
import LogsList from '@/components/calls/logs-list'

export default function CallLogsPage() {
  const { setTitle, setSubtitle } = useLayout()

  useEffect(() => {
    setTitle('Call Logs');
    setSubtitle('View and manage incoming call records');
  }, [])

  const { calls, isLoading, refetch } = useCallLogs()

  if (isLoading) {
    return (
      <CallsSkeleton />
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards calls={calls} />

      {/* Call Logs List */}
      <LogsList calls={calls} refetch={refetch} />
    </div>
  )
}