// Simplified seed data script for testing analytics and settings pages
import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
const supabaseUrl = 'https://hcdkdshkkvgejpgnijtd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZGtkc2hra3ZnZWpwZ25panRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjc5MTQsImV4cCI6MjA2OTgwMzkxNH0.kaokWRVLfVViERs-79fEBtQ3tHKlHn5U5MD_F-5iWqs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Business ID to seed data for
const BUSINESS_ID = '2f838e01-7b68-4b82-bf87-65f29e0ccfb6'

// Helper functions
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

// Login to get authentication
async function login() {
  // Use an existing account - you'll need to replace these with real credentials
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'testpassword123'
  })
  
  if (error) {
    console.error('Authentication error:', error)
    return false
  }
  
  console.log('Successfully authenticated')
  return true
}

// Create services in the database
async function seedServices() {
  try {
    console.log('Fetching existing services...')
    const { data: existingServices, error: fetchError } = await supabase
      .from('services')
      .select('id, name')
      .eq('business_id', BUSINESS_ID)
    
    if (fetchError) {
      console.error('Error fetching services:', fetchError)
      return []
    }
    
    if (existingServices && existingServices.length > 0) {
      console.log(`Found ${existingServices.length} existing services`)
      return existingServices
    }
    
    console.log('No existing services found. Creating new services...')
    
    // Define services to create
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
        category: 'Consultation'
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
        category: 'Regular Check'
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
        category: 'Therapy'
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
        category: 'Treatment'
      }
    ]
    
    for (const service of services) {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select('id, name')
      
      if (error) {
        console.error(`Error creating service ${service.name}:`, error)
      } else {
        console.log(`Created service: ${service.name}`)
      }
    }
    
    // Get all services
    const { data: createdServices, error } = await supabase
      .from('services')
      .select('id, name')
      .eq('business_id', BUSINESS_ID)
    
    if (error) {
      console.error('Error fetching created services:', error)
      return []
    }
    
    console.log(`Successfully created ${createdServices.length} services`)
    return createdServices
    
  } catch (error) {
    console.error('Error in seedServices:', error)
    return []
  }
}

// Create bookings in the database
async function seedBookings(services) {
  if (!services || services.length === 0) {
    console.error('No services available to create bookings')
    return
  }
  
  try {
    console.log('Creating bookings...')
    
    const statuses = ['confirmed', 'pending', 'completed', 'cancelled']
    const today = new Date()
    
    // Create 10 bookings (smaller number to avoid rate limits)
    for (let i = 0; i < 10; i++) {
      // Pick a random service
      const service = services[Math.floor(Math.random() * services.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      // Generate a date within the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(today.getDate() - 30)
      
      const bookingDate = randomDate(thirtyDaysAgo, today)
      const formattedDate = formatDate(bookingDate)
      
      // Random time
      const hours = Math.floor(Math.random() * 8) + 9 // 9 AM to 5 PM
      const minutes = Math.random() > 0.5 ? '00' : '30'
      const time = `${hours}:${minutes}`
      
      const booking = {
        business_id: BUSINESS_ID,
        service_id: service.id,
        customer_name: `Customer ${i+1}`,
        customer_phone: `+1${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        customer_email: `customer${i+1}@example.com`,
        appointment_date: formattedDate,
        appointment_time: time,
        duration_minutes: 60,
        status,
        notes: 'Sample booking created for testing',
        total_amount: 100,
        currency: 'USD'
      }
      
      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
      
      if (error) {
        console.error(`Error creating booking ${i+1}:`, error)
      } else {
        console.log(`Created booking ${i+1}`)
      }
      
      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    console.log('Bookings creation completed')
    
  } catch (error) {
    console.error('Error in seedBookings:', error)
  }
}

// Create call logs in the database
async function seedCallLogs() {
  try {
    console.log('Creating call logs...')
    
    const intents = ['booking', 'information', 'rescheduling', 'cancellation', 'complaint', 'general']
    const today = new Date()
    
    // Create 20 call logs (smaller number to avoid rate limits)
    for (let i = 0; i < 20; i++) {
      // Generate a date within the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(today.getDate() - 30)
      
      const callDate = randomDate(thirtyDaysAgo, today)
      const callDuration = Math.floor(Math.random() * 300) + 60 // 1-6 minutes
      const intent = intents[Math.floor(Math.random() * intents.length)]
      
      const callLog = {
        business_id: BUSINESS_ID,
        caller_phone: `+1${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        caller_name: `Caller ${i+1}`,
        call_duration_seconds: callDuration,
        call_status: 'completed',
        intent_detected: intent,
        lead_to_booking: Math.random() > 0.6,
        customer_satisfaction_score: Math.floor(Math.random() * 5) + 1,
        created_at: callDate.toISOString()
      }
      
      const { data, error } = await supabase
        .from('call_logs')
        .insert(callLog)
      
      if (error) {
        console.error(`Error creating call log ${i+1}:`, error)
      } else {
        console.log(`Created call log ${i+1}`)
      }
      
      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    console.log('Call logs creation completed')
    
  } catch (error) {
    console.error('Error in seedCallLogs:', error)
  }
}

// Create business settings in the database
async function seedBusinessSettings() {
  try {
    console.log('Creating business settings...')
    
    // Check if business settings already exist
    const { data: existingSettings, error: fetchError } = await supabase
      .from('business_settings')
      .select('*')
      .eq('business_id', BUSINESS_ID)
      .maybeSingle()
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching business settings:', fetchError)
      return
    }
    
    // If settings exist, don't create new ones
    if (existingSettings) {
      console.log('Business settings already exist')
      return
    }
    
    // Create business settings - simplified structure based on errors
    const businessSettings = {
      business_id: BUSINESS_ID
    }
    
    const { data, error } = await supabase
      .from('business_settings')
      .insert(businessSettings)
    
    if (error) {
      console.error('Error creating business settings:', error)
    } else {
      console.log('Business settings created successfully')
    }
    
  } catch (error) {
    console.error('Error in seedBusinessSettings:', error)
  }
}

// Main function
async function main() {
  console.log('Starting data seeding process...')
  
  // First authenticate
  const isAuthenticated = await login()
  if (!isAuthenticated) {
    console.error('Authentication failed. Cannot proceed with seeding.')
    return
  }
  
  try {
    // Create services
    const services = await seedServices()
    
    // Create bookings
    await seedBookings(services)
    
    // Create call logs
    await seedCallLogs()
    
    // Create business settings
    await seedBusinessSettings()
    
    console.log('Data seeding completed!')
  } catch (error) {
    console.error('Error during seeding process:', error)
  }
}

// Run the main function
main()