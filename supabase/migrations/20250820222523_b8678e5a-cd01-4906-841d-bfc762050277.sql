-- CRITICAL SECURITY FIX: Remove conflicting RLS policies on whatsapp_codes
-- Issue: PERMISSIVE policies are conflicting, creating unpredictable security behavior  
-- Fix: Use RESTRICTIVE policy to ensure proper access control

-- Drop all existing policies to start clean
DROP POLICY IF EXISTS "secure_whatsapp_codes_service_only" ON public.whatsapp_codes;
DROP POLICY IF EXISTS "secure_whatsapp_codes_deny_users" ON public.whatsapp_codes;

-- Ensure RLS is enabled
ALTER TABLE public.whatsapp_codes ENABLE ROW LEVEL SECURITY;

-- Create a single, secure RESTRICTIVE policy that ONLY allows service_role access
-- RESTRICTIVE policies use AND logic, ensuring stricter security
CREATE POLICY "whatsapp_codes_service_role_only" 
ON public.whatsapp_codes 
AS RESTRICTIVE
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Explicitly block all other roles (authenticated, anon, etc.)
-- This creates a fail-safe that denies access to anyone except service_role
CREATE POLICY "whatsapp_codes_block_all_others" 
ON public.whatsapp_codes 
AS RESTRICTIVE
FOR ALL 
TO authenticated, anon
USING (false)
WITH CHECK (false);