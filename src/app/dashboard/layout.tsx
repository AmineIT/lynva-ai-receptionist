"use client"

import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from '@/components/ui/site-header'
import { LayoutProvider } from '@/components/ui/layout-context'
import { useUserProfile } from '@/hooks/useUserProfile'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Enable redirect checking for dashboard pages
  const { isLoading, hasProfile } = useUserProfile({ enableRedirect: true })

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

  // This will automatically redirect to business setup if no profile exists
  // due to the enableRedirect: true option above

  return (
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
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </LayoutProvider>
  )
}
