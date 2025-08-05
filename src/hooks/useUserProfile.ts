import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function useUserProfile() {
  const { user } = useAuth()
  const router = useRouter()

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

  // Redirect to business setup if user doesn't have a profile
  useEffect(() => {
    if (user && !isLoading && !userProfile) {
      router.push('/business-setup')
    }
  }, [user, isLoading, userProfile, router])

  return {
    userProfile,
    isLoading,
    hasProfile: !!userProfile,
    businessId: userProfile?.business_id,
    refetch
  }
}
