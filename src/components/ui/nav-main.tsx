import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Navigation } from "@/hooks/use-navigation"

export function NavMain({ items }: {items: Navigation['navMain']}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="flex flex-col gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} data-active={item.isActive ? "true" : undefined}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={item.onClick}
                className={`transition-colors duration-200 hover:bg-zinc-100 hover:text-accent-foreground focus:bg-zinc-100 focus:text-accent-foreground ${
                  item.isActive ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground" : ""
                }`}
                aria-current={item.isActive ? "page" : undefined}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
