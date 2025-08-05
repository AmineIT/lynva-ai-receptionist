import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useUserProfile } from './useUserProfile'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'
import type { Service } from '@/lib/supabase'

interface CreateServiceData {
  name: string
  description?: string
  duration_minutes: number
  price?: number
  currency?: string
  is_active?: boolean
  booking_buffer_minutes?: number
  max_advance_booking_days?: number
  practitioner_name?: string
  category?: string
}

interface UpdateServiceData extends Partial<CreateServiceData> {
  id: string
}

interface ServiceFilters {
  is_active?: boolean
  category?: string
  search?: string
  page?: number
  pageSize?: number
}

export function useServices(filters: ServiceFilters = {}) {
  const { user } = useAuth()
  const { businessId } = useUserProfile()
  const queryClient = useQueryClient()
  const queryKey = ['services', businessId, filters]
  
  // Set up real-time subscription for services
  useEffect(() => {
    if (!businessId) return
    
    const channel = supabase
      .channel('services_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          console.log('Service change received:', payload)
          // Invalidate and refetch services data
          queryClient.invalidateQueries({ queryKey: ['services', businessId] })
          queryClient.invalidateQueries({ queryKey: ['active-services', businessId] })
          
          // Show toast notification for real-time updates
          if (payload.eventType === 'INSERT') {
            toast.success('New service created!')
          } else if (payload.eventType === 'UPDATE') {
            toast.success('Service updated!')
          } else if (payload.eventType === 'DELETE') {
            toast.success('Service removed!')
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [businessId, queryClient])
  
  // Fetch services
  const {
    data: servicesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!businessId) return { services: [], total: 0 }
      
      let query = supabase
        .from('services')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId)
        .order('name', { ascending: true })
      
      // Apply filters
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      
      // Apply pagination
      const page = filters.page || 1
      const pageSize = filters.pageSize || 20
      const offset = (page - 1) * pageSize
      query = query.range(offset, offset + pageSize - 1)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      return {
        services: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    },
    enabled: !!businessId
  })
  
  // Create service mutation
  const createService = useMutation({
    mutationFn: async (serviceData: CreateServiceData) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          business_id: businessId,
          currency: serviceData.currency || 'AED',
          is_active: serviceData.is_active !== undefined ? serviceData.is_active : true,
          booking_buffer_minutes: serviceData.booking_buffer_minutes || 15,
          max_advance_booking_days: serviceData.max_advance_booking_days || 30
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Service created successfully!')
      queryClient.invalidateQueries({ queryKey: ['services', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to create service: ${error.message}`)
    }
  })
  
  // Update service mutation
  const updateService = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateServiceData) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('services')
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
      toast.success('Service updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['services', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to update service: ${error.message}`)
    }
  })
  
  // Delete service mutation
  const deleteService = useMutation({
    mutationFn: async (serviceId: string) => {
      if (!businessId) throw new Error('No business ID found')
      
      // Check if service is used in any bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('service_id', serviceId)
        .limit(1)
      
      if (bookingsError) throw bookingsError
      
      if (bookings && bookings.length > 0) {
        throw new Error('Cannot delete service that has associated bookings. Please deactivate it instead.')
      }
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('business_id', businessId)
      
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Service deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['services', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to delete service: ${error.message}`)
    }
  })
  
  // Toggle service active status
  const toggleServiceStatus = useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string, isActive: boolean }) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('services')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId)
        .eq('business_id', businessId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (_, { isActive }) => {
      toast.success(`Service ${isActive ? 'activated' : 'deactivated'} successfully!`)
      queryClient.invalidateQueries({ queryKey: ['services', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to update service status: ${error.message}`)
    }
  })
  
  return {
    services: servicesData?.services || [],
    pagination: servicesData ? {
      total: servicesData.total,
      page: servicesData.page,
      pageSize: servicesData.pageSize,
      totalPages: servicesData.totalPages
    } : null,
    isLoading,
    error,
    refetch,
    createService: createService.mutate,
    updateService: updateService.mutate,
    deleteService: deleteService.mutate,
    toggleServiceStatus: toggleServiceStatus.mutate,
    isCreating: createService.isPending,
    isUpdating: updateService.isPending,
    isDeleting: deleteService.isPending,
    isToggling: toggleServiceStatus.isPending
  }
}

export function useService(serviceId: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      if (!user || !serviceId) return null
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!user && !!serviceId
  })
}

// Get active services for dropdowns
export function useActiveServices() {
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
    queryKey: ['active-services', businessId],
    queryFn: async () => {
      if (!businessId) return []
      
      const { data, error } = await supabase
        .from('services')
        .select('id, name, duration_minutes, price, currency')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('name', { ascending: true })
      
      if (error) throw error
      return data || []
    },
    enabled: !!businessId
  })
}
