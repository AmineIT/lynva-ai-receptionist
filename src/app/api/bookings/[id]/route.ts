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
  updateBookingSchema,
  type UpdateBookingData
} from '@/lib/validators'

// PUT /api/bookings/[id] - Update a booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const bookingId = params.id
    const body = await parseRequestBody(request)
    
    const validatedData = updateBookingSchema.parse(body) as UpdateBookingData
    
    const supabase = createSupabaseServerClient()
    
    // Check if booking exists and belongs to the business
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', bookingId)
      .eq('business_id', businessId)
      .maybeSingle()
    
    if (fetchError) {
      return handleDatabaseError(fetchError)
    }
    
    if (!existingBooking) {
      return createErrorResponse('Booking not found', 404)
    }
    
    // If service_id is being updated, get service details
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
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .eq('business_id', businessId)
      .select()
      .single()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Invalidate cache
    invalidateCache(['/dashboard/bookings', '/dashboard'])
    
    return createSuccessResponse(data)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    if (error.name === 'ZodError') {
      return handleValidationError(error)
    }
    
    console.error('PUT /api/bookings/[id] error:', error)
    return createErrorResponse('Failed to update booking', 500)
  }
}

// DELETE /api/bookings/[id] - Delete a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const bookingId = params.id
    
    const supabase = createSupabaseServerClient()
    
    // Check if booking exists and belongs to the business
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, customer_name')
      .eq('id', bookingId)
      .eq('business_id', businessId)
      .maybeSingle()
    
    if (fetchError) {
      return handleDatabaseError(fetchError)
    }
    
    if (!existingBooking) {
      return createErrorResponse('Booking not found', 404)
    }
    
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)
      .eq('business_id', businessId)
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    // Invalidate cache
    invalidateCache(['/dashboard/bookings', '/dashboard'])
    
    return createSuccessResponse({ 
      message: 'Booking deleted successfully',
      deleted: existingBooking
    })
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    console.error('DELETE /api/bookings/[id] error:', error)
    return createErrorResponse('Failed to delete booking', 500)
  }
}

// GET /api/bookings/[id] - Get a specific booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { businessId } = await getAuthenticatedUser()
    const bookingId = params.id
    
    const supabase = createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('business_id', businessId)
      .maybeSingle()
    
    if (error) {
      return handleDatabaseError(error)
    }
    
    if (!data) {
      return createErrorResponse('Booking not found', 404)
    }
    
    return createSuccessResponse(data)
    
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401)
    }
    
    console.error('GET /api/bookings/[id] error:', error)
    return createErrorResponse('Failed to fetch booking', 500)
  }
}
