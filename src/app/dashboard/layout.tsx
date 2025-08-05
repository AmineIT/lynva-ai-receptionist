"use client"

import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from '@/components/ui/site-header'
import { LayoutProvider } from '@/components/ui/layout-context'

function DashboardLayout({ children }: { children: React.ReactNode }) {

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
