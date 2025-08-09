import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useUserProfile } from './useUserProfile'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'

interface CreateBookingData {
  service_id?: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  notes?: string
  total_amount?: number
  status?: string
}

interface UpdateBookingData extends Partial<CreateBookingData> {
  id: string
}

interface BookingFilters {
  status?: string
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  pageSize?: number
}

export function useBookings(filters: BookingFilters = {}) {
  const { businessId } = useUserProfile()
  const queryClient = useQueryClient()
  
  const queryKey = ['bookings', businessId, filters]
  
  // Set up real-time subscription for bookings
  useEffect(() => {
    if (!businessId) return
    
    const channel = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          console.log('Booking change received:', payload)
          // Invalidate and refetch bookings data
          queryClient.invalidateQueries({ queryKey: ['bookings', businessId] })
          queryClient.invalidateQueries({ queryKey: ['dashboard-analytics', businessId] })
          
          // Show toast notification for real-time updates
          if (payload.eventType === 'INSERT') {
            toast.success('New booking received!')
          } else if (payload.eventType === 'UPDATE') {
            toast.success('Booking updated!')
          } else if (payload.eventType === 'DELETE') {
            toast.success('Booking removed!')
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [businessId, queryClient])
  
  // Fetch bookings
  const {
    data: bookingsData,
    isLoading,
    error,
    refetch,
    status
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!businessId) return { bookings: [], total: 0 }
      
      let query = supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false })
      
      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      
      if (filters.date_from) {
        query = query.gte('appointment_date', filters.date_from)
      }
      
      if (filters.date_to) {
        query = query.lte('appointment_date', filters.date_to)
      }
      
      if (filters.search) {
        query = query.or(`customer_name.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`)
      }
      
      // Apply pagination
      const page = filters.page || 1
      const pageSize = filters.pageSize || 20
      const offset = (page - 1) * pageSize
      query = query.range(offset, offset + pageSize - 1)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      return {
        bookings: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    },
    enabled: !!businessId
  })
  
  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          business_id: businessId,
          currency: 'AED',
          status: bookingData.status || 'confirmed'
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Booking created successfully!')
      queryClient.invalidateQueries({ queryKey: ['bookings', businessId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to create booking: ${error.message}`)
    }
  })
  
  // Update booking mutation
  const updateBooking = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateBookingData) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('bookings')
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
      toast.success('Booking updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['bookings', businessId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to update booking: ${error.message}`)
    }
  })
  
  // Delete booking mutation
  const deleteBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .eq('business_id', businessId)
      
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Booking deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['bookings', businessId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to delete booking: ${error.message}`)
    }
  })
  
  return {
    bookings: bookingsData?.bookings || [],
    pagination: bookingsData ? {
      total: bookingsData.total,
      page: bookingsData.page,
      pageSize: bookingsData.pageSize,
      totalPages: bookingsData.totalPages
    } : null,
    isLoading,
    error,
    refetch,
    createBooking: createBooking.mutate,
    updateBooking: updateBooking.mutate,
    deleteBooking: deleteBooking.mutate,
    isCreating: createBooking.isPending,
    isUpdating: updateBooking.isPending,
    isDeleting: deleteBooking.isPending,
    status
  }
}

export function useBooking(bookingId: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!user || !bookingId) return null
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!user && !!bookingId
  })
}
