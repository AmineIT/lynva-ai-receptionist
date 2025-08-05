import * as React from "react"

import { NavMain } from "@/components/ui/nav-main"
import { NavSecondary } from "@/components/ui/nav-secondary"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AudioWaveform } from 'lucide-react'
import { useNavigation } from "@/hooks/use-navigation"
import { useAuth } from '@/lib/auth'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigation = useNavigation()
  const { user } = useAuth()
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <AudioWaveform className="!size-5" />
                <span className="text-base font-semibold">Lynva</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
        <NavSecondary items={navigation.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ email: user?.email || '' }} />
      </SidebarFooter>
    </Sidebar>
  )
}
