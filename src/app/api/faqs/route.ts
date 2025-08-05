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
  createFaqSchema,
  faqFiltersSchema,
  type CreateFaqData,
  type FaqFilters
} from '@/lib/validators'

// GET /api/faqs - List FAQs with filters
export async function GET(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const filters = parseSearchParams(request, faqFiltersSchema) as FaqFilters
    
    const supabase = createSupabaseServerClient()
    
    let query = supabase
      .from('faqs')
      .select('*')
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
    const offset = (filters.page - 1) * filters.pageSize
    query = query.range(offset, offset + filters.pageSize - 1)
    
    const { data, error } = await query
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('faqs')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
    
    return createSuccessResponse({
      faqs: data || [],
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
    
    console.error('GET /api/faqs error:', error)
    return createErrorResponse('Failed to fetch FAQs', 500)
  }
}

// POST /api/faqs - Create a new FAQ
export async function POST(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const body = await parseRequestBody(request)
    
    const validatedData = createFaqSchema.parse(body) as CreateFaqData
    
    const supabase = createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('faqs')
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
    invalidateCache(['/dashboard/content', '/dashboard'])
    
    return createSuccessResponse(data, 201)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    if (error.name === 'ZodError') {
      return handleValidationError(error)
    }
    
    console.error('POST /api/faqs error:', error)
    return createErrorResponse('Failed to create FAQ', 500)
  }
}
