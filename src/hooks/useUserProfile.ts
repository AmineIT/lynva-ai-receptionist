import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'

export function useUserProfile(options?: { enableRedirect?: boolean }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const enableRedirect = options?.enableRedirect ?? false

  // Check if user profile exists in custom users table
  const { data: userProfile, isLoading, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      
      const { data, error } = await supabase
        .from('users')
        .select('*, businesses(*)')
        .eq('id', user.id)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

  // Only redirect to business setup if explicitly enabled and not already on auth/setup pages
  useEffect(() => {
    if (
      enableRedirect &&
      user && 
      !isLoading && 
      !userProfile && 
      !pathname?.startsWith('/auth') && 
      !pathname?.startsWith('/business-setup')
    ) {
      router.push('/business-setup')
    }
  }, [user, isLoading, userProfile, router, pathname, enableRedirect])

  return {
    userProfile,
    isLoading,
    hasProfile: !!userProfile,
    businessId: userProfile?.business_id,
    refetch
  }
}
