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
  updateFaqSchema,
  type UpdateFaqData
} from '@/lib/validators'

// PUT /api/faqs/[id] - Update an FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const faqId = params.id
    const body = await parseRequestBody(request)
    
    const validatedData = updateFaqSchema.parse(body) as UpdateFaqData
    
    const supabase = createSupabaseServerClient()
    
    // Check if FAQ exists and belongs to the business
    const { data: existingFaq, error: fetchError } = await supabase
      .from('faqs')
      .select('id')
      .eq('id', faqId)
      .eq('business_id', businessId)
      .maybeSingle()
    
    if (fetchError) {
      return handleDatabaseError(fetchError)
    }
    
    if (!existingFaq) {
      return createErrorResponse('FAQ not found', 404)
    }
    
    const { data, error } = await supabase
      .from('faqs')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', faqId)
      .eq('business_id', businessId)
      .select()
      .single()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Invalidate cache
    invalidateCache(['/dashboard/content', '/dashboard'])
    
    return createSuccessResponse(data)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    if (error.name === 'ZodError') {
      return handleValidationError(error)
    }
    
    console.error('PUT /api/faqs/[id] error:', error)
    return createErrorResponse('Failed to update FAQ', 500)
  }
}

// DELETE /api/faqs/[id] - Delete an FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const faqId = params.id
    
    const supabase = createSupabaseServerClient()
    
    // Check if FAQ exists and belongs to the business
    const { data: existingFaq, error: fetchError } = await supabase
      .from('faqs')
      .select('id, question')
      .eq('id', faqId)
      .eq('business_id', businessId)
      .maybeSingle()
    
    if (fetchError) {
      return handleDatabaseError(fetchError)
    }
    
    if (!existingFaq) {
      return createErrorResponse('FAQ not found', 404)
    }
    
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', faqId)
      .eq('business_id', businessId)
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Invalidate cache
    invalidateCache(['/dashboard/content', '/dashboard'])
    
    return createSuccessResponse({ 
      message: 'FAQ deleted successfully',
      deleted: existingFaq
    })
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    console.error('DELETE /api/faqs/[id] error:', error)
    return createErrorResponse('Failed to delete FAQ', 500)
  }
}

// GET /api/faqs/[id] - Get a specific FAQ
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const faqId = params.id
    
    const supabase = createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('id', faqId)
      .eq('business_id', businessId)
      .maybeSingle()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    if (!data) {
      return createErrorResponse('FAQ not found', 404)
    }
    
    return createSuccessResponse(data)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    console.error('GET /api/faqs/[id] error:', error)
    return createErrorResponse('Failed to fetch FAQ', 500)
  }
}
