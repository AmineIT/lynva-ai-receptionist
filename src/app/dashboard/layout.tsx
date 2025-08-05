"use client"

import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from '@/components/ui/site-header'
import { LayoutProvider } from '@/components/ui/layout-context'
import { useUserProfile } from '@/hooks/useUserProfile'
import { BusinessSetupModal } from '@/components/ui/business-setup-modal'
import { useState, useEffect } from 'react'
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Load user profile without redirects - we'll handle the setup via modal
  const { isLoading, hasProfile, refetch } = useUserProfile({ enableRedirect: false })
  const { refetch: refetchDashboardAnalytics } = useDashboardAnalytics()
  const [showBusinessSetup, setShowBusinessSetup] = useState(false)

  // Show business setup modal if user doesn't have a profile
  // Use useEffect to prevent setting state during render
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (!isLoading && !hasProfile) {
      timer = setTimeout(() => {
        setShowBusinessSetup(true);
      }, 2000);
    } else if (hasProfile) {
      setShowBusinessSetup(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, hasProfile]);

  // Show loading while checking profile
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  const handleBusinessSetupComplete = () => {
    refetch()
    refetchDashboardAnalytics()
  }

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <div className="flex min-h-screen w-full">
          {/* Sidebar */}
          <AppSidebar variant="inset" className="fixed left-0 h-full bg-neutral-100 w-[210px]" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen pt-2 pl-[210px]">
              {/* Header */}
              <SiteHeader />

              {/* Main Content Area */}
              <main className="flex-1 p-6 space-y-4">
                {children}
              </main>
            </div>
        </div>

      </SidebarProvider>

      {/* Business Setup Modal */}
      <BusinessSetupModal 
        isOpen={showBusinessSetup} 
        onComplete={handleBusinessSetupComplete}
      />
    </>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </LayoutProvider>
  )
}
