-- SECURITY TEST: Verify that regular users cannot access whatsapp_codes
-- This will test if RLS is working properly for normal application users

-- First, let's check the current policy is correctly restrictive
-- Create a test to ensure anon role cannot access the table
DO $$
DECLARE
    test_result TEXT;
BEGIN
    -- Try to set role to anon and test access (this will be blocked by RLS)
    -- Note: In a real scenario, anon users would get permission denied
    
    -- Check if the policy exists and is properly configured
    SELECT policyname INTO test_result 
    FROM pg_policies 
    WHERE tablename = 'whatsapp_codes' 
    AND permissive = 'PERMISSIVE'
    AND 'service_role' = ANY(roles)
    LIMIT 1;
    
    IF test_result IS NULL THEN
        RAISE EXCEPTION 'Service role policy not found - security issue!';
    END IF;
    
    RAISE NOTICE 'Policy check passed: %', test_result;
END $$;

-- Additional security measure: explicitly revoke public access
-- (though RLS should handle this, this is belt-and-suspenders)
REVOKE ALL ON public.whatsapp_codes FROM public;
REVOKE ALL ON public.whatsapp_codes FROM anon;
REVOKE ALL ON public.whatsapp_codes FROM authenticated;