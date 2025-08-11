'use client'

import { useState, useEffect } from 'react'
import { useLayout } from '@/components/providers/layout-provider'
import { useFaqs } from '@/hooks/useFaqs'
import { ContentSkeleton } from '@/components/contents/content-skeleton'
import StatsCards from '@/components/contents/stats-cards'
import FaqModal from '@/components/contents/faq-modal'
import FaqList from '@/components/contents/faq-list'

export default function ContentPage() {
  const [showCreateFaqDialog, setShowCreateFaqDialog] = useState(false)
  const { setTitle, setSubtitle } = useLayout()

  // Use the FAQs hook
  const { isLoading, status } = useFaqs();

  useEffect(() => {
    setTitle('Content Management');
    setSubtitle('Manage FAQ content for your AI receptionist');
  }, []);

  if (isLoading || status === 'pending') {
    return (
      <ContentSkeleton />
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsCards />

      {/* FAQ Modal */}
      <FaqModal showCreateFaqDialog={showCreateFaqDialog} setShowCreateFaqDialog={setShowCreateFaqDialog} />

      {/* FAQ List */}
      <FaqList setShowCreateFaqDialog={setShowCreateFaqDialog} />
    </div>
  )
}
