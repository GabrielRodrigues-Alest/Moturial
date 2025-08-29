-- 001_init.sql: Create all base tables for motorcycle rental platform

-- Organizations (holding company)
CREATE TABLE public.orgs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  document_id TEXT, -- CNPJ
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Franchises (belong to organizations)
CREATE TABLE public.franchises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Stores (belong to franchises)
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchise_id UUID NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  phone TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Organization members (staff)
CREATE TABLE public.org_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  franchise_id UUID REFERENCES public.franchises(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'staff', -- admin, franchise_manager, store_manager, staff
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, org_id)
);

-- Update profiles table to include staff flag
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS document_id TEXT,
ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT false;

-- Bike models (global or per org)
CREATE TABLE public.bike_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  colors TEXT[] DEFAULT '{}', -- ['preta', 'vermelha', 'azul']
  specs JSONB DEFAULT '{}', -- technical specifications
  image_urls TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual bikes (inventory)
CREATE TABLE public.bikes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  bike_model_id UUID NOT NULL REFERENCES public.bike_models(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  plate TEXT UNIQUE,
  vin TEXT UNIQUE,
  status TEXT DEFAULT 'available', -- available, reserved, rented, maintenance, unavailable
  odometer INTEGER DEFAULT 0,
  last_maintenance_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rental plans (pricing)
CREATE TABLE public.rental_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_type TEXT NOT NULL, -- hour, day, month, year
  duration_qty INTEGER NOT NULL DEFAULT 1,
  base_price_cents INTEGER NOT NULL,
  deposit_cents INTEGER DEFAULT 0,
  price_rules JSONB DEFAULT '{}', -- future: weekend markup, seasonal pricing
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rentals (bookings)
CREATE TABLE public.rentals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  bike_id UUID NOT NULL REFERENCES public.bikes(id) ON DELETE CASCADE,
  rental_plan_id UUID NOT NULL REFERENCES public.rental_plans(id) ON DELETE CASCADE,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, reserved, active, completed, canceled, overdue
  price_cents INTEGER NOT NULL,
  deposit_cents INTEGER DEFAULT 0,
  km_start INTEGER,
  km_end INTEGER,
  pickup_notes TEXT,
  return_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Invoices (payments)
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id UUID REFERENCES public.rentals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded, canceled
  gateway TEXT, -- pagarme
  gateway_payment_id TEXT,
  payment_method TEXT, -- card, pix, boleto
  boleto_url TEXT,
  pix_qr_code TEXT,
  pix_copy_paste TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  due_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Accessories (products for sale)
CREATE TABLE public.accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Accessory orders
CREATE TABLE public.accessory_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, paid, preparing, ready, completed, canceled
  total_cents INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Accessory order items
CREATE TABLE public.accessory_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.accessory_orders(id) ON DELETE CASCADE,
  accessory_id UUID NOT NULL REFERENCES public.accessories(id) ON DELETE CASCADE,
  qty INTEGER NOT NULL DEFAULT 1,
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Two-factor authentication codes
CREATE TABLE public.twofa_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  channel TEXT NOT NULL, -- sms, whatsapp, email
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  consumed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_franchises_org_id ON public.franchises(org_id);
CREATE INDEX idx_stores_franchise_id ON public.stores(franchise_id);
CREATE INDEX idx_org_members_user_id ON public.org_members(user_id);
CREATE INDEX idx_org_members_org_id ON public.org_members(org_id);
CREATE INDEX idx_bikes_store_id ON public.bikes(store_id);
CREATE INDEX idx_bikes_status ON public.bikes(status);
CREATE INDEX idx_rentals_user_id ON public.rentals(user_id);
CREATE INDEX idx_rentals_bike_id ON public.rentals(bike_id);
CREATE INDEX idx_rentals_status ON public.rentals(status);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_rental_id ON public.invoices(rental_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_twofa_codes_user_id ON public.twofa_codes(user_id);
CREATE INDEX idx_twofa_codes_expires_at ON public.twofa_codes(expires_at);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;