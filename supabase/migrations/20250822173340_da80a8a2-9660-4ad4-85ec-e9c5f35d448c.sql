-- Fix the security definer view issue by removing SECURITY DEFINER from view
-- and updating the function to have proper search path
DROP VIEW IF EXISTS public.available_bikes_public;

-- Create a standard view without SECURITY DEFINER
CREATE VIEW public.available_bikes_public AS
SELECT 
  b.id,
  b.color,
  b.status,
  b.odometer,
  bm.brand,
  bm.model,
  bm.year,
  bm.image_urls,
  bm.specs,
  s.name as store_name,
  s.city,
  s.state
FROM public.bikes b
JOIN public.bike_models bm ON b.bike_model_id = bm.id
JOIN public.stores s ON b.store_id = s.id
WHERE b.status = 'available' AND s.active = true AND bm.active = true;

-- Update the function with proper search path
CREATE OR REPLACE FUNCTION public.get_available_bikes_public()
RETURNS SETOF public.available_bikes_public
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT * FROM public.available_bikes_public;
$$;