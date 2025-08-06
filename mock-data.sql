-- This SQL file contains mock data insert statements for testing
-- You would need to run this in the Supabase SQL editor with the appropriate permissions

-- Insert services
INSERT INTO services (business_id, name, description, duration_minutes, price, currency, is_active, booking_buffer_minutes, max_advance_booking_days, practitioner_name, category)
VALUES 
  ('2f838e01-7b68-4b82-bf87-65f29e0ccfb6', 'Initial Consultation', 'A comprehensive first-time assessment of your needs.', 60, 120, 'USD', true, 15, 30, 'Dr. Sarah Johnson', 'Consultation'),
  ('2f838e01-7b68-4b82-bf87-65f29e0ccfb6', 'Wellness Check', 'Regular wellness check and assessment.', 45, 90, 'USD', true, 10, 60, 'Dr. Michael Lee', 'Regular Check'),
  ('2f838e01-7b68-4b82-bf87-65f29e0ccfb6', 'Therapy Session', 'One-on-one therapy session.', 50, 110, 'USD', true, 10, 30, 'Dr. Emily Chen', 'Therapy'),
  ('2f838e01-7b68-4b82-bf87-65f29e0ccfb6', 'Treatment Plan Review', 'Review and adjust your ongoing treatment plan.', 30, 75, 'USD', true, 5, 14, 'Dr. Robert Wilson', 'Treatment');

-- Get service IDs for reference in bookings
WITH service_ids AS (
  SELECT id FROM services WHERE business_id = '2f838e01-7b68-4b82-bf87-65f29e0ccfb6' LIMIT 4
)
-- Insert bookings
INSERT INTO bookings (business_id, service_id, customer_name, customer_phone, customer_email, appointment_date, appointment_time, duration_minutes, status, notes, total_amount, currency)
SELECT 
  '2f838e01-7b68-4b82-bf87-65f29e0ccfb6',
  id,
  'Customer ' || generate_series,
  '+1' || (FLOOR(random() * 9000000000) + 1000000000)::text,
  'customer' || generate_series || '@example.com',
  (CURRENT_DATE - (FLOOR(random() * 30)::int || ' days')::interval)::date,
  (9 + FLOOR(random() * 8))::text || ':' || (CASE WHEN random() > 0.5 THEN '00' ELSE '30' END),
  FLOOR(random() * 60)::int + 30,
  (ARRAY['confirmed', 'pending', 'completed', 'cancelled'])[1 + FLOOR(random() * 4)::int],
  'Sample booking created for testing',
  FLOOR(random() * 150)::int + 50,
  'USD'
FROM 
  service_ids,
  generate_series(1, 10);

-- Insert call logs
INSERT INTO call_logs (business_id, caller_phone, caller_name, call_duration_seconds, call_status, intent_detected, lead_to_booking, customer_satisfaction_score, created_at)
SELECT
  '2f838e01-7b68-4b82-bf87-65f29e0ccfb6',
  '+1' || (FLOOR(random() * 9000000000) + 1000000000)::text,
  'Caller ' || generate_series,
  FLOOR(random() * 300)::int + 60,
  'completed',
  (ARRAY['booking', 'information', 'rescheduling', 'cancellation', 'complaint', 'general'])[1 + FLOOR(random() * 6)::int],
  random() > 0.6,
  FLOOR(random() * 5)::int + 1,
  (CURRENT_TIMESTAMP - (FLOOR(random() * 30)::int || ' days')::interval)
FROM
  generate_series(1, 20);

-- Insert business settings (if the table exists)
INSERT INTO business_settings (business_id)
VALUES ('2f838e01-7b68-4b82-bf87-65f29e0ccfb6')
ON CONFLICT (business_id) DO NOTHING;