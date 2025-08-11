import { z } from 'zod'

// Booking validation schemas
export const createBookingSchema = z.object({
  service_id: z.string().uuid('Service is required'),
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_phone: z.string().min(1, 'Customer phone is required'),
  customer_email: z.string().email().optional().or(z.literal('')),
  appointment_date: z.string().min(1, 'Appointment date is required'),
  appointment_time: z.string().min(1, 'Appointment time is required'),
  notes: z.string().optional(),
  status: z.enum(['confirmed', 'pending', 'cancelled', 'completed']).default('confirmed')
})

export const updateBookingSchema = createBookingSchema.partial()

// Service validation schemas
export const createServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().min(1, 'Description is required'),
  duration_minutes: z.number().min(15, 'Duration must be at least 15 minutes'),
  price: z.number().min(1, 'Price must be positive'),
  is_active: z.boolean().default(true),
  booking_buffer_minutes: z.number().default(15),
  max_advance_booking_days: z.number().default(30),
  practitioner_name: z.string().optional(),
  category: z.string().min(1, 'Category is required')
})

export const updateServiceSchema = createServiceSchema.partial()

// FAQ validation schemas
export const createFaqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().min(1, 'Category is required'),
  is_active: z.boolean().default(true)
})

export const updateFaqSchema = createFaqSchema.partial()

// Business validation schemas
export const updateBusinessSchema = z.object({
  name: z.string().min(1, 'Business name is required').optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default('UAE').optional(),
  timezone: z.string().default('Asia/Dubai').optional(),
  business_hours: z.any().optional(),
  website: z.string().url().optional().or(z.literal(''))
})

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20)
})

export const bookingFiltersSchema = paginationSchema.extend({
  status: z.enum(['confirmed', 'pending', 'cancelled', 'completed']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  search: z.string().optional()
})

export const serviceFiltersSchema = paginationSchema.extend({
  is_active: z.coerce.boolean().optional(),
  category: z.string().optional(),
  search: z.string().optional()
})

export const faqFiltersSchema = paginationSchema.extend({
  is_active: z.coerce.boolean().optional(),
  category: z.string().optional(),
  search: z.string().optional()
})

export const callLogFiltersSchema = paginationSchema.extend({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  intent_detected: z.string().optional(),
  lead_to_booking: z.coerce.boolean().optional(),
  search: z.string().optional()
})

// Type exports
export type CreateBookingData = z.infer<typeof createBookingSchema>
export type UpdateBookingData = z.infer<typeof updateBookingSchema>
export type CreateServiceData = z.infer<typeof createServiceSchema>
export type UpdateServiceData = z.infer<typeof updateServiceSchema>
export type CreateFaqData = z.infer<typeof createFaqSchema>
export type UpdateFaqData = z.infer<typeof updateFaqSchema>
export type UpdateBusinessData = z.infer<typeof updateBusinessSchema>
export type BookingFilters = z.infer<typeof bookingFiltersSchema>
export type ServiceFilters = z.infer<typeof serviceFiltersSchema>
export type FaqFilters = z.infer<typeof faqFiltersSchema>
export type CallLogFilters = z.infer<typeof callLogFiltersSchema>
