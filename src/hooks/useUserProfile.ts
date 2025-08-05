import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

export function useUserProfile(options?: { enableRedirect?: boolean }) {
  const { user } = useAuth()
  
  // Note: enableRedirect is kept for backwards compatibility but no longer used
  // Business setup is now handled via modal in dashboard layout

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

  return {
    userProfile,
    isLoading,
    hasProfile: !!userProfile,
    businessId: userProfile?.business_id,
    refetch
  }
}
