-- CRITICAL SECURITY FIX: Completely secure whatsapp_codes table
-- Remove all public access and restrict to service role only

-- Drop ALL existing policies on whatsapp_codes
DROP POLICY IF EXISTS "System manages whatsapp codes" ON public.whatsapp_codes;
DROP POLICY IF EXISTS "Service role manages whatsapp codes" ON public.whatsapp_codes;
DROP POLICY IF EXISTS "Block anonymous access to whatsapp codes" ON public.whatsapp_codes;

-- Ensure RLS is enabled
ALTER TABLE public.whatsapp_codes ENABLE ROW LEVEL SECURITY;

-- Create single restrictive policy: ONLY service_role can access
CREATE POLICY "whatsapp_codes_service_role_only" 
ON public.whatsapp_codes 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Explicitly deny all access to authenticated and anonymous users
CREATE POLICY "whatsapp_codes_deny_all_users" 
ON public.whatsapp_codes 
FOR ALL 
TO authenticated, anon
USING (false)
WITH CHECK (false);