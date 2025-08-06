import os
import random
import json
import uuid
from datetime import datetime, timedelta
import time
from supabase import create_client, Client

# Supabase configuration
supabase_url = "https://hcdkdshkkvgejpgnijtd.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZGtkc2hra3ZnZWpwZ25panRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjc5MTQsImV4cCI6MjA2OTgwMzkxNH0.kaokWRVLfVViERs-79fEBtQ3tHKlHn5U5MD_F-5iWqs"

# Create a Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

# Business ID to seed data for
BUSINESS_ID = "2f838e01-7b68-4b82-bf87-65f29e0ccfb6"

# Helper functions
def random_date(start_date, end_date):
    """Generate a random date between start_date and end_date."""
    time_delta = end_date - start_date
    days_delta = time_delta.days
    random_days = random.randint(0, days_delta)
    return start_date + timedelta(days=random_days)

def format_date(date):
    """Format a date to ISO string YYYY-MM-DD."""
    return date.strftime("%Y-%m-%d")

def get_random_phone():
    """Generate a random phone number."""
    return f"+1{random.randint(1000000000, 9999999999)}"

# Authentication
def login():
    """Log in to Supabase with service role for admin access."""
    try:
        # Try to get session status first
        response = supabase.auth.get_session()
        if response.session:
            print("Already authenticated")
            return True
            
        # If not authenticated, let's try to log in with demo account
        response = supabase.auth.sign_in_with_password({
            "email": "test@example.com",
            "password": "password123"
        })
        print("Successfully authenticated")
        return True
    except Exception as e:
        print(f"Authentication error: {e}")
        # Proceed without authentication - relying on RLS policies allowing operations
        # or on public access
        return True

# Seed services data
def seed_services():
    """Create services for the business."""
    print("Seeding services...")
    
    # Check if services already exist
    try:
        response = supabase.table("services").select("id, name").eq("business_id", BUSINESS_ID).execute()
        existing_services = response.data
        
        if existing_services and len(existing_services) > 0:
            print(f"Found {len(existing_services)} existing services")
            return existing_services
            
        print("No existing services found. Creating new services...")
        
        # Define services to create
        services = [
            {
                "business_id": BUSINESS_ID,
                "name": "Initial Consultation",
                "description": "A comprehensive first-time assessment of your needs.",
                "duration_minutes": 60,
                "price": 120,
                "currency": "USD",
                "is_active": True,
                "booking_buffer_minutes": 15,
                "max_advance_booking_days": 30,
                "practitioner_name": "Dr. Sarah Johnson",
                "category": "Consultation"
            },
            {
                "business_id": BUSINESS_ID,
                "name": "Wellness Check",
                "description": "Regular wellness check and assessment.",
                "duration_minutes": 45,
                "price": 90,
                "currency": "USD",
                "is_active": True,
                "booking_buffer_minutes": 10,
                "max_advance_booking_days": 60,
                "practitioner_name": "Dr. Michael Lee",
                "category": "Regular Check"
            },
            {
                "business_id": BUSINESS_ID,
                "name": "Therapy Session",
                "description": "One-on-one therapy session.",
                "duration_minutes": 50,
                "price": 110,
                "currency": "USD",
                "is_active": True,
                "booking_buffer_minutes": 10,
                "max_advance_booking_days": 30,
                "practitioner_name": "Dr. Emily Chen",
                "category": "Therapy"
            },
            {
                "business_id": BUSINESS_ID,
                "name": "Treatment Plan Review",
                "description": "Review and adjust your ongoing treatment plan.",
                "duration_minutes": 30,
                "price": 75,
                "currency": "USD",
                "is_active": True,
                "booking_buffer_minutes": 5,
                "max_advance_booking_days": 14,
                "practitioner_name": "Dr. Robert Wilson",
                "category": "Treatment"
            }
        ]
        
        created_services = []
        
        for service in services:
            try:
                response = supabase.table("services").insert(service).execute()
                if response.data:
                    created_service = response.data[0]
                    print(f"Created service: {created_service['name']}")
                    created_services.append(created_service)
                else:
                    print(f"Failed to create service: {service['name']}")
            except Exception as e:
                print(f"Error creating service {service['name']}: {e}")
                
        if not created_services:
            # Try to fetch services again in case they were created but response was empty
            response = supabase.table("services").select("id, name").eq("business_id", BUSINESS_ID).execute()
            created_services = response.data
            
        print(f"Successfully created/fetched {len(created_services)} services")
        return created_services
        
    except Exception as e:
        print(f"Error in seed_services: {e}")
        return []

# Seed bookings data
def seed_bookings(services):
    """Create bookings for the business."""
    if not services or len(services) == 0:
        print("No services available to create bookings")
        return
        
    print("Seeding bookings...")
    
    try:
        statuses = ["confirmed", "pending", "completed", "cancelled"]
        today = datetime.now()
        thirty_days_ago = today - timedelta(days=30)
        
        # Create 10 bookings (smaller number to avoid rate limits)
        for i in range(10):
            # Pick a random service
            service = random.choice(services)
            status = random.choice(statuses)
            
            # Generate a date within the last 30 days
            booking_date = random_date(thirty_days_ago, today)
            formatted_date = format_date(booking_date)
            
            # Random time
            hours = random.randint(9, 16)  # 9 AM to 4 PM
            minutes = "00" if random.random() > 0.5 else "30"
            time_str = f"{hours}:{minutes}"
            
            booking = {
                "business_id": BUSINESS_ID,
                "service_id": service["id"],
                "customer_name": f"Customer {i+1}",
                "customer_phone": get_random_phone(),
                "customer_email": f"customer{i+1}@example.com",
                "appointment_date": formatted_date,
                "appointment_time": time_str,
                "duration_minutes": 60,
                "status": status,
                "notes": "Sample booking created for testing",
                "total_amount": 100,
                "currency": "USD"
            }
            
            try:
                response = supabase.table("bookings").insert(booking).execute()
                if response.data:
                    print(f"Created booking {i+1}")
                else:
                    print(f"Failed to create booking {i+1}")
            except Exception as e:
                print(f"Error creating booking {i+1}: {e}")
                
            # Add a small delay to avoid rate limits
            time.sleep(0.2)
            
        print("Bookings creation completed")
        
    except Exception as e:
        print(f"Error in seed_bookings: {e}")

# Seed call logs data
def seed_call_logs():
    """Create call logs for the business."""
    print("Seeding call logs...")
    
    try:
        intents = ["booking", "information", "rescheduling", "cancellation", "complaint", "general"]
        today = datetime.now()
        thirty_days_ago = today - timedelta(days=30)
        
        # Create 20 call logs (smaller number to avoid rate limits)
        for i in range(20):
            # Generate a date within the last 30 days
            call_date = random_date(thirty_days_ago, today)
            call_duration = random.randint(60, 360)  # 1-6 minutes
            intent = random.choice(intents)
            
            call_log = {
                "business_id": BUSINESS_ID,
                "caller_phone": get_random_phone(),
                "caller_name": f"Caller {i+1}",
                "call_duration_seconds": call_duration,
                "call_status": "completed",
                "intent_detected": intent,
                "lead_to_booking": random.random() > 0.6,
                "customer_satisfaction_score": random.randint(1, 5),
                "created_at": call_date.isoformat()
            }
            
            try:
                response = supabase.table("call_logs").insert(call_log).execute()
                if response.data:
                    print(f"Created call log {i+1}")
                else:
                    print(f"Failed to create call log {i+1}")
            except Exception as e:
                print(f"Error creating call log {i+1}: {e}")
                
            # Add a small delay to avoid rate limits
            time.sleep(0.2)
            
        print("Call logs creation completed")
        
    except Exception as e:
        print(f"Error in seed_call_logs: {e}")

# Seed business settings data
def seed_business_settings():
    """Create business settings for the business."""
    print("Seeding business settings...")
    
    try:
        # Check if business settings already exist
        response = supabase.table("business_settings").select("*").eq("business_id", BUSINESS_ID).execute()
        existing_settings = response.data
        
        if existing_settings and len(existing_settings) > 0:
            print("Business settings already exist")
            return
            
        # Create business settings
        business_settings = {
            "business_id": BUSINESS_ID,
        }
        
        try:
            response = supabase.table("business_settings").insert(business_settings).execute()
            if response.data:
                print("Business settings created successfully")
            else:
                print("Failed to create business settings")
        except Exception as e:
            print(f"Error creating business settings: {e}")
            
    except Exception as e:
        print(f"Error in seed_business_settings: {e}")

# Main function
def main():
    """Main function to run all seeding operations."""
    print("Starting data seeding process...")
    
    # First authenticate (optional, depending on your Supabase RLS policies)
    is_authenticated = login()
    
    try:
        # Create services
        services = seed_services()
        
        # Create bookings
        seed_bookings(services)
        
        # Create call logs
        seed_call_logs()
        
        # Create business settings
        seed_business_settings()
        
        print("Data seeding completed!")
    except Exception as e:
        print(f"Error during seeding process: {e}")

if __name__ == "__main__":
    main()