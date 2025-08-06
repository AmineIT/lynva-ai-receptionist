import { NextRequest } from 'next/server'
import {
  createSupabaseServerClient,
  getAuthenticatedUser,
  createErrorResponse,
  createSuccessResponse,
  handleValidationError,
  handleDatabaseError,
  parseRequestBody,
  invalidateCache
} from '@/lib/api-utils'
import {
  updateBusinessSchema,
  type UpdateBusinessData
} from '@/lib/validators'

// GET /api/business - Get business settings
export async function GET(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    
    const supabase = createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .maybeSingle()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    if (!data) {
      return createErrorResponse('Business not found', 404)
    }
    
    return createSuccessResponse(data)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    console.error('GET /api/business error:', error)
    return createErrorResponse('Failed to fetch business settings', 500)
  }
}

// PUT /api/business - Update business settings
export async function PUT(request: NextRequest) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const body = await parseRequestBody(request)
    
    const validatedData = updateBusinessSchema.parse(body) as UpdateBusinessData
    
    const supabase = createSupabaseServerClient()
    
    // Check if business exists
    const { data: existingBusiness, error: fetchError } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', businessId)
      .maybeSingle()
    
    if (fetchError) {
      return handleDatabaseError(fetchError)
    }
    
    if (!existingBusiness) {
      return createErrorResponse('Business not found', 404)
    }
    
    const { data, error } = await supabase
      .from('businesses')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId)
      .select()
      .single()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Invalidate cache
    invalidateCache(['/dashboard/settings', '/dashboard'])
    
    return createSuccessResponse(data)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    if (error.name === 'ZodError') {
      return handleValidationError(error)
    }
    
    console.error('PUT /api/business error:', error)
    return createErrorResponse('Failed to update business settings', 500)
  }
}
