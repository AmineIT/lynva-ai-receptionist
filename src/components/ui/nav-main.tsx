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
                className={[
                  "transition-colors duration-200",
                  "hover:bg-neutral-200 hover:text-accent-foreground",
                  "focus:bg-neutral-200 focus:text-accent-foreground",
                  item.isActive
                    ? "bg-white text-primary hover:bg-white hover:text-primary focus:bg-white focus:text-primary border border-neutral-200"
                    : "text-neutral-500 hover:text-accent-foreground"
                ].join(" ")}
                aria-current={item.isActive ? "page" : undefined}
              >
                {item.icon && (
                  <item.icon
                    className={item.isActive ? "text-primary" : undefined}
                  />
                )}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
