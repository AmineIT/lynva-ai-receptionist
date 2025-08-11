import { NextRequest } from 'next/server'
import {
  createSupabaseServerClient,
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
  handleValidationError,
  handleDatabaseError,
  parseRequestBody,
  parseSearchParams,
  invalidateCache
} from '@/lib/api-utils'
import {
  createBookingSchema,
  bookingFiltersSchema,
  type CreateBookingData,
  type BookingFilters
} from '@/lib/validators'

// GET /api/bookings - List bookings with filters
export async function GET(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const filters = parseSearchParams(request, bookingFiltersSchema) as BookingFilters
    
    const supabase = createSupabaseServerClient()
    
    let query = supabase
      .from('bookings')
      .select('*')
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
    const offset = (filters.page - 1) * filters.pageSize
    query = query.range(offset, offset + filters.pageSize - 1)
    
    const { data, error, count } = await query
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
    
    return createSuccessResponse({
      bookings: data || [],
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
    
    console.error('GET /api/bookings error:', error)
    return createErrorResponse('Failed to fetch bookings', 500)
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const body = await parseRequestBody(request)
    
    const validatedData = createBookingSchema.parse(body) as CreateBookingData
    
    const supabase = createSupabaseServerClient()
    
    // If service_id is provided, get service details for duration and pricing
    if (validatedData.service_id) {
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('duration_minutes, price, currency')
        .eq('id', validatedData.service_id)
        .eq('business_id', businessId)
        .maybeSingle()
      
      if (serviceError) {
        return handleDatabaseError(serviceError)
      }
      
      if (!service) {
        return createErrorResponse('Service not found', 404)
      }
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...validatedData,
        business_id: businessId,
        currency: 'AED'
      })
      .select()
      .single()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Invalidate cache
    invalidateCache(['/dashboard/bookings', '/dashboard'])
    
    return createSuccessResponse(data, 201)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    if (error.name === 'ZodError') {
      return handleValidationError(error)
    }
    
    console.error('POST /api/bookings error:', error)
    return createErrorResponse('Failed to create booking', 500)
  }
}
