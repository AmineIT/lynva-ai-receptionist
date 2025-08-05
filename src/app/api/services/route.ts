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
  createServiceSchema,
  serviceFiltersSchema,
  type CreateServiceData,
  type ServiceFilters
} from '@/lib/validators'

// GET /api/services - List services with filters
export async function GET(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const filters = parseSearchParams(request, serviceFiltersSchema) as ServiceFilters
    
    const supabase = createSupabaseServerClient()
    
    let query = supabase
      .from('services')
      .select('*')
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
    const offset = (filters.page - 1) * filters.pageSize
    query = query.range(offset, offset + filters.pageSize - 1)
    
    const { data, error } = await query
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
    
    return createSuccessResponse({
      services: data || [],
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
    
    console.error('GET /api/services error:', error)
    return createErrorResponse('Failed to fetch services', 500)
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const body = await parseRequestBody(request)
    
    const validatedData = createServiceSchema.parse(body) as CreateServiceData
    
    const supabase = createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('services')
      .insert({
        ...validatedData,
        business_id: businessId
      })
      .select()
      .single()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Invalidate cache
    invalidateCache(['/dashboard/services', '/dashboard'])
    
    return createSuccessResponse(data, 201)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    if (error.name === 'ZodError') {
      return handleValidationError(error)
    }
    
    console.error('POST /api/services error:', error)
    return createErrorResponse('Failed to create service', 500)
  }
}
