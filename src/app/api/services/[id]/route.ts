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
  updateServiceSchema,
  type UpdateServiceData
} from '@/lib/validators'

// PUT /api/services/[id] - Update a service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const serviceId = params.id
    const body = await parseRequestBody(request)
    
    const validatedData = updateServiceSchema.parse(body) as UpdateServiceData
    
    const supabase = createSupabaseServerClient()
    
    // Check if service exists and belongs to the business
    const { data: existingService, error: fetchError } = await supabase
      .from('services')
      .select('id')
      .eq('id', serviceId)
      .eq('business_id', businessId)
      .maybeSingle()
    
    if (fetchError) {
      return handleDatabaseError(fetchError)
    }
    
    if (!existingService) {
      return createErrorResponse('Service not found', 404)
    }
    
    const { data, error } = await supabase
      .from('services')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId)
      .eq('business_id', businessId)
      .select()
      .single()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Invalidate cache
    invalidateCache(['/dashboard/services', '/dashboard'])
    
    return createSuccessResponse(data)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    if (error.name === 'ZodError') {
      return handleValidationError(error)
    }
    
    console.error('PUT /api/services/[id] error:', error)
    return createErrorResponse('Failed to update service', 500)
  }
}

// DELETE /api/services/[id] - Delete a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const serviceId = params.id
    
    const supabase = createSupabaseServerClient()
    
    // Check if service exists and belongs to the business
    const { data: existingService, error: fetchError } = await supabase
      .from('services')
      .select('id, name')
      .eq('id', serviceId)
      .eq('business_id', businessId)
      .maybeSingle()
    
    if (fetchError) {
      return handleDatabaseError(fetchError)
    }
    
    if (!existingService) {
      return createErrorResponse('Service not found', 404)
    }
    
    // Check if service is used in any bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .eq('service_id', serviceId)
      .limit(1)
    
    if (bookingsError) {
      return handleDatabaseError(bookingsError)
    }
    
    if (bookings && bookings.length > 0) {
      return createErrorResponse(
        'Cannot delete service that has associated bookings. Please deactivate it instead.',
        400
      )
    }
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)
      .eq('business_id', businessId)
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Invalidate cache
    invalidateCache(['/dashboard/services', '/dashboard'])
    
    return createSuccessResponse({ 
      message: 'Service deleted successfully',
      deleted: existingService
    })
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    console.error('DELETE /api/services/[id] error:', error)
    return createErrorResponse('Failed to delete service', 500)
  }
}

// GET /api/services/[id] - Get a specific service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const serviceId = params.id
    
    const supabase = createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .eq('business_id', businessId)
      .maybeSingle()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    if (!data) {
      return createErrorResponse('Service not found', 404)
    }
    
    return createSuccessResponse(data)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    console.error('GET /api/services/[id] error:', error)
    return createErrorResponse('Failed to fetch service', 500)
  }
}
