import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

// Create Supabase client for API routes
export function createSupabaseServerClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Get authenticated user and business ID
export async function getAuthenticatedUser() {
  const supabase = createSupabaseServerClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Authentication required')
  }

  // Get user's business ID
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('business_id')
    .eq('id', user.id)
    .maybeSingle()

  if (userError) {
    throw new Error('Failed to get user data')
  }

  if (!userData?.business_id) {
    throw new Error('No business associated with user')
  }

  return {
    user,
    businessId: userData.business_id
  }
}

// Standard error responses
export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    { error: message },
    { status }
  )
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

// Handle validation errors
export function handleValidationError(error: any) {
  if (error.name === 'ZodError') {
    const fieldErrors = error.errors.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message
    }))
    
    return createErrorResponse(
      `Validation failed: ${fieldErrors.map((e: any) => e.message).join(', ')}`,
      422
    )
  }
  
  return createErrorResponse('Invalid request data', 400)
}

// Handle database errors
export function handleDatabaseError(error: any) {
  console.error('Database error:', error)
  
  if (error.code === '23505') {
    return createErrorResponse('A record with this data already exists', 409)
  }
  
  if (error.code === '23503') {
    return createErrorResponse('Referenced record does not exist', 400)
  }
  
  return createErrorResponse('Database operation failed', 500)
}

// Parse and validate request body
export async function parseRequestBody(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    throw new Error('Invalid JSON in request body')
  }
}

// Parse URL search params with validation
export function parseSearchParams(request: NextRequest, schema: any) {
  const searchParams = request.nextUrl.searchParams
  const params: any = {}
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return schema.parse(params)
}

// Cache invalidation helpers
export function invalidateCache(paths: string[]) {
  paths.forEach(path => {
    revalidatePath(path)
  })
}

export function invalidateCacheTag(tags: string[]) {
  tags.forEach(tag => {
    revalidateTag(tag)
  })
}
