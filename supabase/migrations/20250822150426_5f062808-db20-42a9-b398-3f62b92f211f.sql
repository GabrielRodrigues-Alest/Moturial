-- SECURITY FIX: Simplify WhatsApp codes RLS policies for clarity and security
-- Remove conflicting RESTRICTIVE policies and use a single PERMISSIVE policy
-- This ensures only service_role can access verification codes with clear, predictable behavior

-- Drop existing policies
DROP POLICY IF EXISTS "whatsapp_codes_service_role_only" ON public.whatsapp_codes;
DROP POLICY IF EXISTS "whatsapp_codes_block_all_others" ON public.whatsapp_codes;

-- Ensure RLS is enabled
ALTER TABLE public.whatsapp_codes ENABLE ROW LEVEL SECURITY;

-- Create a single, secure PERMISSIVE policy that ONLY allows service_role access
-- PERMISSIVE policies use OR logic and are more straightforward
CREATE POLICY "whatsapp_codes_service_only" 
ON public.whatsapp_codes 
AS PERMISSIVE
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- This approach is cleaner because:
-- 1. Only service_role gets any access (via the PERMISSIVE policy)
-- 2. All other roles (anon, authenticated, etc.) get no access by default
-- 3. No conflicting policies that could create unpredictable behavior
-- 4. Clear security intent: only the service can manage verification codes