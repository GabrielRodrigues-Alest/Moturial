-- CRITICAL SECURITY FIX: Properly restrict profiles table access
-- Issue: RLS policies currently apply to 'public' role (includes anonymous users)
-- Fix: Restrict policies to 'authenticated' users only and explicitly deny anonymous access

-- Drop existing policies that apply to 'public' role
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create secure policies that ONLY apply to authenticated users
CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- CRITICAL: Explicitly deny ALL access to anonymous users
CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

-- Add restrictive policy to ensure no data leakage
CREATE POLICY "Restrict profiles access" 
ON public.profiles 
AS RESTRICTIVE
FOR ALL 
TO public
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);