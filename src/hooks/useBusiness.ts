import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import type { Business } from '@/lib/supabase'

interface UpdateBusinessData {
  name?: string
  description?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  country?: string
  timezone?: string
  business_hours?: any
  website?: string
}

export function useBusiness() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  // Get user's business ID
  const { data: userData } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await supabase
        .from('users')
        .select('business_id')
        .eq('id', user.id)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })
  
  const businessId = userData?.business_id
  
  // Fetch business settings
  const {
    data: business,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      if (!businessId) return null
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!businessId
  })
  
  // Update business mutation
  const updateBusiness = useMutation({
    mutationFn: async (updateData: UpdateBusinessData) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('businesses')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Business settings updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['business', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to update business settings: ${error.message}`)
    }
  })
  
  return {
    business,
    isLoading,
    error,
    refetch,
    updateBusiness: updateBusiness.mutate,
    isUpdating: updateBusiness.isPending
  }
}
