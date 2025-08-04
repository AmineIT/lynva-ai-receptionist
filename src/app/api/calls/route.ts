import { NextRequest } from 'next/server'
import {
  createSupabaseServerClient,
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
  handleDatabaseError,
  handleValidationError,
  parseSearchParams
} from '@/lib/api-utils'
import {
  callLogFiltersSchema,
  type CallLogFilters
} from '@/lib/validators'

// GET /api/calls - List call logs with filters
export async function GET(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const filters = parseSearchParams(request, callLogFiltersSchema) as CallLogFilters
    
    const supabase = createSupabaseServerClient()
    
    let query = supabase
      .from('call_logs')
      .select('*')
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
    const offset = (filters.page - 1) * filters.pageSize
    query = query.range(offset, offset + filters.pageSize - 1)
    
    const { data, error } = await query
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
    
    return createSuccessResponse({
      calls: data || [],
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / filters.pageSize)
      }
    })
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    if (error.name === 'ZodError') {
      return handleValidationError(error)
    }
    
    console.error('GET /api/calls error:', error)
    return createErrorResponse('Failed to fetch call logs', 500)
  }
}
