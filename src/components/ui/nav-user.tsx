import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from './separator'
import { LogOut } from 'lucide-react'
import { Button } from './button'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function NavUser({ user }: { user: { email: string } }) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  return (
    <SidebarMenu>
      <Separator className="my-2" />
      <SidebarMenuItem className='mb-2'>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg text-white bg-neutral-500">
              {user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Business Owner</span>
            <span className="text-zinc-500 truncate text-xs dark:text-zinc-400">
              {user.email}
            </span>
          </div>
        </div>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
