import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'

interface CreateFaqData {
  question: string
  answer: string
  category?: string
  is_active?: boolean
}

interface UpdateFaqData extends Partial<CreateFaqData> {
  id: string
}

interface FaqFilters {
  is_active?: boolean
  category?: string
  search?: string
  page?: number
  pageSize?: number
}

export function useFaqs(filters: FaqFilters = {}) {
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
  const queryKey = ['faqs', businessId, filters]
  
  // Set up real-time subscription for FAQs
  useEffect(() => {
    if (!businessId) return
    
    const channel = supabase
      .channel('faqs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'faqs',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          console.log('FAQ change received:', payload)
          // Invalidate and refetch FAQs data
          queryClient.invalidateQueries({ queryKey: ['faqs', businessId] })
          queryClient.invalidateQueries({ queryKey: ['faq-categories', businessId] })
          
          // Show toast notification for real-time updates
          if (payload.eventType === 'INSERT') {
            toast.success('New FAQ created!')
          } else if (payload.eventType === 'UPDATE') {
            toast.success('FAQ updated!')
          } else if (payload.eventType === 'DELETE') {
            toast.success('FAQ removed!')
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [businessId, queryClient])
  
  // Fetch FAQs
  const {
    data: faqsData,
    isLoading,
    error,
    refetch,
    status
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!businessId) return { faqs: [], total: 0 }
      
      let query = supabase
        .from('faqs')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId)
        .order('usage_count', { ascending: false })
        .order('created_at', { ascending: false })
      
      // Apply filters
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.search) {
        query = query.or(`question.ilike.%${filters.search}%,answer.ilike.%${filters.search}%`)
      }
      
      // Apply pagination
      const page = filters.page || 1
      const pageSize = filters.pageSize || 20
      const offset = (page - 1) * pageSize
      query = query.range(offset, offset + pageSize - 1)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      return {
        faqs: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    },
    enabled: !!businessId
  })
  
  // Create FAQ mutation
  const createFaq = useMutation({
    mutationFn: async (faqData: CreateFaqData) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('faqs')
        .insert({
          ...faqData,
          business_id: businessId,
          is_active: faqData.is_active !== undefined ? faqData.is_active : true
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('FAQ created successfully!')
      queryClient.invalidateQueries({ queryKey: ['faqs', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to create FAQ: ${error.message}`)
    }
  })
  
  // Update FAQ mutation
  const updateFaq = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateFaqData) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('faqs')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('business_id', businessId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('FAQ updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['faqs', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to update FAQ: ${error.message}`)
    }
  })
  
  // Delete FAQ mutation
  const deleteFaq = useMutation({
    mutationFn: async (faqId: string) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', faqId)
        .eq('business_id', businessId)
      
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('FAQ deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['faqs', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to delete FAQ: ${error.message}`)
    }
  })
  
  // Toggle FAQ active status
  const toggleFaqStatus = useMutation({
    mutationFn: async ({ faqId, isActive }: { faqId: string, isActive: boolean }) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('faqs')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', faqId)
        .eq('business_id', businessId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (_, { isActive }) => {
      toast.success(`FAQ ${isActive ? 'activated' : 'deactivated'} successfully!`)
      queryClient.invalidateQueries({ queryKey: ['faqs', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to update FAQ status: ${error.message}`)
    }
  })
  
  return {
    faqs: faqsData?.faqs || [],
    pagination: faqsData ? {
      total: faqsData.total,
      page: faqsData.page,
      pageSize: faqsData.pageSize,
      totalPages: faqsData.totalPages
    } : null,
    isLoading,
    error,
    refetch,
    createFaq: createFaq.mutate,
    updateFaq: updateFaq.mutate,
    deleteFaq: deleteFaq.mutate,
    toggleFaqStatus: toggleFaqStatus.mutate,
    isCreating: createFaq.isPending,
    isUpdating: updateFaq.isPending,
    isDeleting: deleteFaq.isPending,
    isToggling: toggleFaqStatus.isPending,
    status
  }
}

export function useFaq(faqId: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['faq', faqId],
    queryFn: async () => {
      if (!user || !faqId) return null
      
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('id', faqId)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!user && !!faqId
  })
}

// Get FAQ categories for filtering
export function useFaqCategories() {
  const { user } = useAuth()
  
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
  
  return useQuery({
    queryKey: ['faq-categories', businessId],
    queryFn: async () => {
      if (!businessId) return []
      
      const { data, error } = await supabase
        .from('faqs')
        .select('category')
        .eq('business_id', businessId)
        .not('category', 'is', null)
      
      if (error) throw error
      
      // Get unique categories
      const categories = Array.from(new Set(data?.map(item => item.category).filter(Boolean)))
      return categories || []
    },
    enabled: !!businessId
  })
}
