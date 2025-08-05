-- Migration: implement_proper_multitenant_rls
-- Created at: 1754422536

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Authenticated users can view businesses" ON public.businesses;
DROP POLICY IF EXISTS "Authenticated users can update businesses" ON public.businesses;
DROP POLICY IF EXISTS "Anyone can create businesses" ON public.businesses;

DROP POLICY IF EXISTS "Authenticated users can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can manage bookings" ON public.bookings;

DROP POLICY IF EXISTS "Authenticated users can view services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services;

DROP POLICY IF EXISTS "Authenticated users can view FAQs" ON public.faqs;
DROP POLICY IF EXISTS "Authenticated users can manage FAQs" ON public.faqs;

DROP POLICY IF EXISTS "Authenticated users can view call logs" ON public.call_logs;
DROP POLICY IF EXISTS "Authenticated users can manage call logs" ON public.call_logs;

DROP POLICY IF EXISTS "Authenticated users can view WhatsApp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Authenticated users can manage WhatsApp messages" ON public.whatsapp_messages;

DROP POLICY IF EXISTS "Authenticated users can view analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Authenticated users can manage analytics events" ON public.analytics_events;

DROP POLICY IF EXISTS "Authenticated users can view business settings" ON public.business_settings;
DROP POLICY IF EXISTS "Authenticated users can manage business settings" ON public.business_settings;

DROP POLICY IF EXISTS "Authenticated users can view calendar integrations" ON public.calendar_integrations;
DROP POLICY IF EXISTS "Authenticated users can manage calendar integrations" ON public.calendar_integrations;

-- Create a helper function to get the current user's business_id
CREATE OR REPLACE FUNCTION get_current_user_business_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT business_id FROM public.users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Businesses table policies
-- Users can create businesses (needed for business setup)
CREATE POLICY "Users can create businesses" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can view businesses they own
CREATE POLICY "Users can view own businesses" ON public.businesses
  FOR SELECT USING (
    id IN (
      SELECT business_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Users can update businesses they own  
CREATE POLICY "Users can update own businesses" ON public.businesses
  FOR UPDATE USING (
    id IN (
      SELECT business_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Bookings table policies
CREATE POLICY "Users can view own business bookings" ON public.bookings
  FOR SELECT USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can insert own business bookings" ON public.bookings
  FOR INSERT WITH CHECK (business_id = get_current_user_business_id());

CREATE POLICY "Users can update own business bookings" ON public.bookings
  FOR UPDATE USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can delete own business bookings" ON public.bookings
  FOR DELETE USING (business_id = get_current_user_business_id());

-- Services table policies
CREATE POLICY "Users can view own business services" ON public.services
  FOR SELECT USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can insert own business services" ON public.services
  FOR INSERT WITH CHECK (business_id = get_current_user_business_id());

CREATE POLICY "Users can update own business services" ON public.services
  FOR UPDATE USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can delete own business services" ON public.services
  FOR DELETE USING (business_id = get_current_user_business_id());

-- FAQs table policies
CREATE POLICY "Users can view own business FAQs" ON public.faqs
  FOR SELECT USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can insert own business FAQs" ON public.faqs
  FOR INSERT WITH CHECK (business_id = get_current_user_business_id());

CREATE POLICY "Users can update own business FAQs" ON public.faqs
  FOR UPDATE USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can delete own business FAQs" ON public.faqs
  FOR DELETE USING (business_id = get_current_user_business_id());

-- Call logs table policies
CREATE POLICY "Users can view own business call logs" ON public.call_logs
  FOR SELECT USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can insert own business call logs" ON public.call_logs
  FOR INSERT WITH CHECK (business_id = get_current_user_business_id());

CREATE POLICY "Users can update own business call logs" ON public.call_logs
  FOR UPDATE USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can delete own business call logs" ON public.call_logs
  FOR DELETE USING (business_id = get_current_user_business_id());

-- WhatsApp messages table policies  
CREATE POLICY "Users can view own business WhatsApp messages" ON public.whatsapp_messages
  FOR SELECT USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can insert own business WhatsApp messages" ON public.whatsapp_messages
  FOR INSERT WITH CHECK (business_id = get_current_user_business_id());

CREATE POLICY "Users can update own business WhatsApp messages" ON public.whatsapp_messages
  FOR UPDATE USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can delete own business WhatsApp messages" ON public.whatsapp_messages
  FOR DELETE USING (business_id = get_current_user_business_id());

-- Analytics events table policies
CREATE POLICY "Users can view own business analytics events" ON public.analytics_events
  FOR SELECT USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can insert own business analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (business_id = get_current_user_business_id());

CREATE POLICY "Users can update own business analytics events" ON public.analytics_events
  FOR UPDATE USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can delete own business analytics events" ON public.analytics_events
  FOR DELETE USING (business_id = get_current_user_business_id());

-- Business settings table policies
CREATE POLICY "Users can view own business settings" ON public.business_settings
  FOR SELECT USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can insert own business settings" ON public.business_settings
  FOR INSERT WITH CHECK (business_id = get_current_user_business_id());

CREATE POLICY "Users can update own business settings" ON public.business_settings
  FOR UPDATE USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can delete own business settings" ON public.business_settings
  FOR DELETE USING (business_id = get_current_user_business_id());

-- Calendar integrations table policies
CREATE POLICY "Users can view own business calendar integrations" ON public.calendar_integrations
  FOR SELECT USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can insert own business calendar integrations" ON public.calendar_integrations
  FOR INSERT WITH CHECK (business_id = get_current_user_business_id());

CREATE POLICY "Users can update own business calendar integrations" ON public.calendar_integrations
  FOR UPDATE USING (business_id = get_current_user_business_id());

CREATE POLICY "Users can delete own business calendar integrations" ON public.calendar_integrations
  FOR DELETE USING (business_id = get_current_user_business_id());;