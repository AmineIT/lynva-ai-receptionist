import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import type { CallLog } from '@/lib/supabase'

interface CallLogFilters {
  date_from?: string
  date_to?: string
  intent_detected?: string
  lead_to_booking?: boolean
  search?: string
  page?: number
  pageSize?: number
}

export function useCallLogs(filters: CallLogFilters = {}) {
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
  const queryKey = ['call-logs', businessId, filters]
  
  // Fetch call logs
  const {
    data: callLogsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!businessId) return { calls: [], total: 0 }
      
      let query = supabase
        .from('call_logs')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
      
      // Apply filters
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from)
      }
      
      if (filters.date_to) {
        const endDate = new Date(filters.date_to)
        endDate.setHours(23, 59, 59, 999)
        query = query.lte('created_at', endDate.toISOString())
      }
      
      if (filters.intent_detected) {
        query = query.eq('intent_detected', filters.intent_detected)
      }
      
      if (filters.lead_to_booking !== undefined) {
        query = query.eq('lead_to_booking', filters.lead_to_booking)
      }
      
      if (filters.search) {
        query = query.or(`caller_phone.ilike.%${filters.search}%,caller_name.ilike.%${filters.search}%`)
      }
      
      // Apply pagination
      const page = filters.page || 1
      const pageSize = filters.pageSize || 20
      const offset = (page - 1) * pageSize
      query = query.range(offset, offset + pageSize - 1)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      return {
        calls: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    },
    enabled: !!businessId
  })
  
  return {
    calls: callLogsData?.calls || [],
    pagination: callLogsData ? {
      total: callLogsData.total,
      page: callLogsData.page,
      pageSize: callLogsData.pageSize,
      totalPages: callLogsData.totalPages
    } : null,
    isLoading,
    error,
    refetch
  }
}

export function useCallLog(callId: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['call-log', callId],
    queryFn: async () => {
      if (!user || !callId) return null
      
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .eq('id', callId)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!user && !!callId
  })
}

// Get call intents for filtering
export function useCallIntents() {
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
    queryKey: ['call-intents', businessId],
    queryFn: async () => {
      if (!businessId) return []
      
      const { data, error } = await supabase
        .from('call_logs')
        .select('intent_detected')
        .eq('business_id', businessId)
        .not('intent_detected', 'is', null)
      
      if (error) throw error
      
      // Get unique intents
      const intents = Array.from(new Set(data?.map(item => item.intent_detected).filter(Boolean)))
      return intents || []
    },
    enabled: !!businessId
  })
}
