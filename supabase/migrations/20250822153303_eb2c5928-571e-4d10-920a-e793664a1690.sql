-- Fix security warnings by setting search_path on functions

-- Fix get_user_org_ids function
CREATE OR REPLACE FUNCTION public.get_user_org_ids(user_uuid UUID)
RETURNS TABLE(org_id UUID, franchise_id UUID, store_id UUID, role TEXT) 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT om.org_id, om.franchise_id, om.store_id, om.role 
  FROM public.org_members om 
  WHERE om.user_id = user_uuid AND om.active = true;
$$;

-- Fix is_user_staff function
CREATE OR REPLACE FUNCTION public.is_user_staff(user_uuid UUID)
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE user_id = user_uuid AND active = true
  );
$$;

-- Fix update_updated_at_column function  
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;