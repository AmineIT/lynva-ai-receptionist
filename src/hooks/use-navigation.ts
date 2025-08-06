import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, PhoneCall, BotMessageSquare, Blocks, Settings2, LifeBuoy, LucideIcon, BarChart, BarChart2 } from 'lucide-react'

interface NavigationItem {
    title: string
    onClick: () => void
    url: string
    icon: LucideIcon
    isActive?: boolean
}

export interface Navigation {
    navMain: NavigationItem[]
    navSecondary: NavigationItem[]
}

export function useNavigation() {
    const router = useRouter()
    const pathname = usePathname()

    const navigation: Navigation = {
        navMain: [
            {
                title: "Dashboard",
                url: '/dashboard',
                onClick: () => router.push('/dashboard'),
                icon: LayoutDashboard,
                isActive: pathname === '/dashboard/',
            },
            {
                title: "Bookings",
                url: '/dashboard/bookings',
                onClick: () => router.push('/dashboard/bookings'),
                icon: Calendar,
                isActive: pathname === '/dashboard/bookings/',
            },
            {
                title: "Call Logs",
                url: '/dashboard/calls',
                onClick: () => router.push('/dashboard/calls'),
                icon: PhoneCall,
                isActive: pathname === '/dashboard/calls/',
            },
            {
                title: "Content",
                url: '/dashboard/content',
                onClick: () => router.push('/dashboard/content'),
                icon: BotMessageSquare,
                isActive: pathname === '/dashboard/content/',
            },
            {
                title: "Services",
                url: '/dashboard/services',
                onClick: () => router.push('/dashboard/services'),
                icon: Blocks,
                isActive: pathname === '/dashboard/services/',
            },
            {
                title: "Analytics",
                url: '/dashboard/analytics',
                onClick: () => router.push('/dashboard/analytics'),
                icon: BarChart2,
                isActive: pathname === '/dashboard/analytics/',
            },
            {
                title: "Settings",
                url: '/dashboard/settings',
                onClick: () => router.push('/dashboard/settings'),
                icon: Settings2,
                isActive: pathname === '/dashboard/settings/',
            },
        ],
        navSecondary: [
            {
                title: "Help & Support",
                url: '/dashboard/help',
                onClick: () => router.push('/dashboard/help'),
                icon: LifeBuoy,
                isActive: pathname === '/dashboard/help/',
            },
        ],
    }

    return navigation
} 