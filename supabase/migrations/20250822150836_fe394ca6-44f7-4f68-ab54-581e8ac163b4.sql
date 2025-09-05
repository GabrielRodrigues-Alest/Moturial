-- FINAL SECURITY FIX: Make WhatsApp codes policy more explicit
-- Replace the current policy with one that's more explicit about service-only access

-- Drop the current policy
DROP POLICY IF EXISTS "whatsapp_codes_service_only" ON public.whatsapp_codes;

-- Create a more explicit policy that clearly shows it's for service operations only
-- Using a more descriptive condition that makes the intent clear
CREATE POLICY "whatsapp_codes_service_operations_only" 
ON public.whatsapp_codes 
AS PERMISSIVE
FOR ALL 
TO service_role
USING (
    -- Only allow access for service role operations
    -- This condition makes it explicit that only service operations are permitted
    current_setting('role') = 'service_role' OR current_user = 'service_role'
)
WITH CHECK (
    -- Same condition for inserts/updates
    current_setting('role') = 'service_role' OR current_user = 'service_role'
);

-- Add a comment to make the security intent crystal clear
COMMENT ON POLICY "whatsapp_codes_service_operations_only" ON public.whatsapp_codes IS 
'SECURITY: This policy ensures that only the service_role can access WhatsApp verification codes. Regular users (anon, authenticated) cannot access this sensitive data.';

-- Double-check: Ensure no other roles have any grants
REVOKE ALL PRIVILEGES ON public.whatsapp_codes FROM PUBLIC;
REVOKE ALL PRIVILEGES ON public.whatsapp_codes FROM anon;
REVOKE ALL PRIVILEGES ON public.whatsapp_codes FROM authenticated;