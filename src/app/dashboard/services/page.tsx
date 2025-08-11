'use client'

import { useState, useEffect } from 'react'
import { useLayout } from '@/components/providers/layout-provider'
import { useServices } from '@/hooks/useServices'
import { ServicesSkeleton } from '@/components/services/services-skeleton'
import StatsCards from '@/components/services/stats-cards'
import ServiceModal from '@/components/services/service-modal'
import ServiceList from '@/components/services/service-list'

export default function ServicesPage() {
  const [showCreateServiceDialog, setShowCreateServiceDialog] = useState(false)
  const { setTitle, setSubtitle } = useLayout()

  // Use the services hook
  const { isLoading, status } = useServices();

  useEffect(() => {
    setTitle('Services');
    setSubtitle('Manage your business services and pricing');
  }, [])

  if (isLoading || status === 'pending') {
    return (
      <ServicesSkeleton />
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsCards />

      {/* Service Modal */}
      <ServiceModal showCreateServiceDialog={showCreateServiceDialog} setShowCreateServiceDialog={setShowCreateServiceDialog} />

      {/* Services List */}
      <ServiceList setShowCreateServiceDialog={setShowCreateServiceDialog} />
    </div>
  )
}