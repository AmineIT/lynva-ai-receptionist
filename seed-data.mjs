// Seed data script for testing analytics and settings pages
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Using hardcoded values for demo.')
}

// Create Supabase client - using hardcoded values if env vars are not available
const supabase = createClient(
  supabaseUrl || 'https://hcdkdshkkvgejpgnijtd.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZGtkc2hra3ZnZWpwZ25panRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjc5MTQsImV4cCI6MjA2OTgwMzkxNH0.kaokWRVLfVViERs-79fEBtQ3tHKlHn5U5MD_F-5iWqs'
)

// Business ID to seed data for
const BUSINESS_ID = '2f838e01-7b68-4b82-bf87-65f29e0ccfb6'

// Helper function to generate random dates within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper function to format date to ISO string
function formatDate(date) {
  return date.toISOString().split('T')[0]
}

// Helper function to get a random element from an array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// --------------------------------------------------------
// 1. Seed Services
// --------------------------------------------------------
async function seedServices() {
  console.log('Seeding services...')
  const services = [
    {
      business_id: BUSINESS_ID,
      name: 'Initial Consultation',
      description: 'A comprehensive first-time assessment of your needs.',
      duration_minutes: 60,
      price: 120,
      currency: 'USD',
      is_active: true,
      booking_buffer_minutes: 15,
      max_advance_booking_days: 30,
      practitioner_name: 'Dr. Sarah Johnson',
      category: 'Consultation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      business_id: BUSINESS_ID,
      name: 'Wellness Check',
      description: 'Regular wellness check and assessment.',
      duration_minutes: 45,
      price: 90,
      currency: 'USD',
      is_active: true,
      booking_buffer_minutes: 10,
      max_advance_booking_days: 60,
      practitioner_name: 'Dr. Michael Lee',
      category: 'Regular Check',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      business_id: BUSINESS_ID,
      name: 'Therapy Session',
      description: 'One-on-one therapy session.',
      duration_minutes: 50,
      price: 110,
      currency: 'USD',
      is_active: true,
      booking_buffer_minutes: 10,
      max_advance_booking_days: 30,
      practitioner_name: 'Dr. Emily Chen',
      category: 'Therapy',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      business_id: BUSINESS_ID,
      name: 'Treatment Plan Review',
      description: 'Review and adjust your ongoing treatment plan.',
      duration_minutes: 30,
      price: 75,
      currency: 'USD',
      is_active: true,
      booking_buffer_minutes: 5,
      max_advance_booking_days: 14,
      practitioner_name: 'Dr. Robert Wilson',
      category: 'Treatment',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  // Insert services and return their IDs
  const { data, error } = await supabase
    .from('services')
    .upsert(services, { onConflict: 'business_id, name' })
    .select('id, name')

  if (error) {
    console.error('Error seeding services:', error)
    return []
  }
  
  console.log(`Successfully seeded ${data.length} services`)
  return data
}

// --------------------------------------------------------
// 2. Seed Bookings
// --------------------------------------------------------
async function seedBookings(services) {
  if (!services || services.length === 0) {
    console.error('No services available to create bookings')
    return
  }

  console.log('Seeding bookings...')
  
  const statuses = ['confirmed', 'pending', 'completed', 'cancelled']
  const bookings = []
  
  // Create 50 bookings with various statuses
  for (let i = 0; i < 50; i++) {
    const service = getRandomItem(services)
    const status = getRandomItem(statuses)
    
    // Generate dates within the last 90 days
    const today = new Date()
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(today.getDate() - 90)
    
    const bookingDate = randomDate(ninetyDaysAgo, today)
    
    // Only set payment for confirmed/completed bookings
    const total_amount = ['confirmed', 'completed'].includes(status) 
      ? (service.price || Math.floor(Math.random() * 200) + 50)
      : null
      
    // Random time slots
    const hours = Math.floor(Math.random() * 8) + 9 // 9 AM to 5 PM
    const minutes = Math.random() > 0.5 ? '00' : '30'
    const time = `${hours}:${minutes}`
    
    bookings.push({
      business_id: BUSINESS_ID,
      service_id: service.id,
      customer_name: `Customer ${i+1}`,
      customer_phone: `+1${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
      customer_email: `customer${i+1}@example.com`,
      appointment_date: formatDate(bookingDate),
      appointment_time: time,
      duration_minutes: Math.floor(Math.random() * 60) + 30,
      status,
      notes: 'Sample booking created for testing',
      total_amount,
      currency: 'USD',
      payment_status: total_amount ? 'paid' : 'pending',
      reminder_sent: Math.random() > 0.5,
      confirmation_sent: Math.random() > 0.3,
      created_via: 'phone',
      created_at: new Date(
        bookingDate.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  const { data, error } = await supabase
    .from('bookings')
    .upsert(bookings)
    .select('id')

  if (error) {
    console.error('Error seeding bookings:', error)
    return
  }
  
  console.log(`Successfully seeded ${data.length} bookings`)
}

// --------------------------------------------------------
// 3. Seed Call Logs
// --------------------------------------------------------
async function seedCallLogs() {
  console.log('Seeding call logs...')
  
  const intents = ['booking', 'information', 'rescheduling', 'cancellation', 'complaint', 'general']
  const calls = []
  
  // Create 100 calls with various dates and durations
  for (let i = 0; i < 100; i++) {
    // Generate dates within the last 90 days
    const today = new Date()
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(today.getDate() - 90)
    
    const callDate = randomDate(ninetyDaysAgo, today)
    const callDuration = Math.floor(Math.random() * 600) + 60 // 1-10 minutes
    const isBooking = Math.random() > 0.6 // 40% of calls lead to bookings
    
    calls.push({
      business_id: BUSINESS_ID,
      vapi_call_id: `vapi-${Date.now()}-${i}`,
      caller_phone: `+1${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
      caller_name: Math.random() > 0.3 ? `Caller ${i+1}` : null, // Some calls don't have names
      call_duration_seconds: callDuration,
      call_status: 'completed',
      intent_detected: getRandomItem(intents),
      transcript: 'Sample transcript of the call for testing purposes.',
      ai_summary: 'Customer called to inquire about services and potentially make a booking.',
      booking_id: isBooking ? null : null, // We don't have real booking IDs yet
      lead_to_booking: isBooking,
      customer_satisfaction_score: isBooking ? (Math.floor(Math.random() * 2) + 4) : (Math.floor(Math.random() * 5) + 1),
      call_cost: (callDuration / 60) * 0.02, // $0.02 per minute
      started_at: callDate.toISOString(),
      ended_at: new Date(callDate.getTime() + callDuration * 1000).toISOString(),
      created_at: callDate.toISOString()
    })
  }

  const { data, error } = await supabase
    .from('call_logs')
    .upsert(calls)
    .select('id')

  if (error) {
    console.error('Error seeding call logs:', error)
    return
  }
  
  console.log(`Successfully seeded ${data.length} call logs`)
}

// --------------------------------------------------------
// 4. Seed Business Settings
// --------------------------------------------------------
async function seedBusinessSettings() {
  console.log('Seeding business settings...')
  
  const businessSettings = {
    business_id: BUSINESS_ID,
    business_hours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '16:00', isOpen: true },
      sunday: { open: '10:00', close: '16:00', isOpen: false }
    },
    notifications: {
      emailBookings: true,
      smsReminders: true,
      callAlerts: true
    },
    integrations: {
      googleCalendar: { enabled: true, connected: true },
      whatsapp: { enabled: true, connected: false },
      vapi: { enabled: true, connected: true }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('business_settings')
    .upsert(businessSettings, { onConflict: 'business_id' })
    .select('*')

  if (error) {
    console.error('Error seeding business settings:', error)
    return
  }
  
  console.log('Successfully seeded business settings')
}

// --------------------------------------------------------
// Main function to run all seeding operations
// --------------------------------------------------------
async function seedAllData() {
  console.log('Starting data seeding process...')
  
  try {
    // Seed services first to get IDs for bookings
    const services = await seedServices()
    
    // Then seed bookings using service IDs
    await seedBookings(services)
    
    // Seed call logs
    await seedCallLogs()
    
    // Seed business settings
    await seedBusinessSettings()
    
    console.log('All data seeded successfully!')
  } catch (error) {
    console.error('Error during seeding process:', error)
  }
}

// Run the seeding process
seedAllData()