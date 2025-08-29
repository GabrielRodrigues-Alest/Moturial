-- Remove the overly permissive policy that allows anyone to view bikes
DROP POLICY IF EXISTS "Anyone can view available bikes" ON public.bikes;

-- Create a new policy that only allows authenticated users to view available bikes
CREATE POLICY "Authenticated users can view available bikes" 
ON public.bikes 
FOR SELECT 
TO authenticated
USING (status = 'available');

-- Create a secure view for public bike information that excludes sensitive data
CREATE OR REPLACE VIEW public.available_bikes_public AS
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

-- Create a function to get available bikes for public use (without sensitive data)
CREATE OR REPLACE FUNCTION public.get_available_bikes_public()
RETURNS SETOF public.available_bikes_public
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM public.available_bikes_public;
$$;