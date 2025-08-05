import { createBrowserSupabase } from '@/utils/supabase/client'

// Next.js environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createBrowserSupabase()

// Database types
export interface Business {
  id: string
  name: string
  description?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  country: string
  timezone: string
  business_hours?: any
  website?: string
  logo_url?: string
  is_active: boolean
  subscription_status: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  business_id?: string
  email: string
  full_name?: string
  role: string
  phone?: string
  avatar_url?: string
  is_active: boolean
  last_login?: string
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  business_id: string
  name: string
  description?: string
  duration_minutes: number
  price?: number
  currency: string
  is_active: boolean
  booking_buffer_minutes: number
  max_advance_booking_days: number
  practitioner_name?: string
  category?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  business_id: string
  service_id?: string
  google_calendar_event_id?: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  status: string
  notes?: string
  total_amount?: number
  currency: string
  payment_status: string
  reminder_sent: boolean
  confirmation_sent: boolean
  created_via: string
  created_at: string
  updated_at: string
}

export interface CallLog {
  id: string
  business_id: string
  vapi_call_id?: string
  caller_phone?: string
  caller_name?: string
  call_duration_seconds?: number
  call_status?: string
  intent_detected?: string
  transcript?: string
  ai_summary?: string
  booking_id?: string
  lead_to_booking: boolean
  customer_satisfaction_score?: number
  call_cost?: number
  started_at?: string
  ended_at?: string
  created_at: string
}

export interface FAQ {
  id: string
  business_id: string
  question: string
  answer: string
  category?: string
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface WhatsAppMessage {
  id: string
  business_id: string
  booking_id?: string
  recipient_phone: string
  message_type: string
  template_name?: string
  message_content?: string
  status: string
  whatsapp_message_id?: string
  delivery_status?: string
  sent_at?: string
  delivered_at?: string
  read_at?: string
  error_message?: string
  created_at: string
}