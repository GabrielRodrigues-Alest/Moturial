-- 002_rls.sql: Create Row Level Security policies

-- Enable RLS on all tables
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bike_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessory_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessory_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twofa_codes ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_org_ids(user_uuid UUID)
RETURNS TABLE(org_id UUID, franchise_id UUID, store_id UUID, role TEXT) AS $$
  SELECT om.org_id, om.franchise_id, om.store_id, om.role 
  FROM public.org_members om 
  WHERE om.user_id = user_uuid AND om.active = true;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_user_staff(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE user_id = user_uuid AND active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles policies (users can only see/edit their own profile)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Orgs policies (staff can view their orgs)
CREATE POLICY "Staff can view their orgs" ON public.orgs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.get_user_org_ids(auth.uid()) 
      WHERE get_user_org_ids.org_id = orgs.id
    )
  );

-- Franchises policies
CREATE POLICY "Staff can view franchises in their org" ON public.franchises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.get_user_org_ids(auth.uid()) 
      WHERE get_user_org_ids.org_id = franchises.org_id
    )
  );

-- Stores policies (public can view active stores, staff can view their stores)
CREATE POLICY "Anyone can view active stores" ON public.stores
  FOR SELECT USING (active = true);

CREATE POLICY "Staff can view all stores in their org" ON public.stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.get_user_org_ids(auth.uid()) g
      JOIN public.franchises f ON f.id = g.franchise_id OR g.franchise_id IS NULL
      WHERE f.id = stores.franchise_id
    )
  );

-- Bike models policies (public can view active models)
CREATE POLICY "Anyone can view active bike models" ON public.bike_models
  FOR SELECT USING (active = true);

-- Bikes policies (public can view available bikes, staff can view their store bikes)
CREATE POLICY "Anyone can view available bikes" ON public.bikes
  FOR SELECT USING (status = 'available');

CREATE POLICY "Staff can view bikes in their stores" ON public.bikes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.get_user_org_ids(auth.uid()) 
      WHERE get_user_org_ids.store_id = bikes.store_id
         OR (get_user_org_ids.store_id IS NULL AND get_user_org_ids.franchise_id IS NOT NULL)
    )
  );

CREATE POLICY "Staff can update bikes in their stores" ON public.bikes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.get_user_org_ids(auth.uid()) 
      WHERE get_user_org_ids.store_id = bikes.store_id
    )
  );

-- Rental plans policies (public can view active plans)
CREATE POLICY "Anyone can view active rental plans" ON public.rental_plans
  FOR SELECT USING (active = true);

-- Rentals policies (users can view/create their own rentals, staff can view rentals for their stores)
CREATE POLICY "Users can view own rentals" ON public.rentals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rentals" ON public.rentals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view store rentals" ON public.rentals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.get_user_org_ids(auth.uid()) 
      WHERE get_user_org_ids.store_id = rentals.store_id
    )
  );

CREATE POLICY "Staff can update store rentals" ON public.rentals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.get_user_org_ids(auth.uid()) 
      WHERE get_user_org_ids.store_id = rentals.store_id
    )
  );

-- Invoices policies (users can view their own invoices)
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Accessories policies (public can view active accessories)
CREATE POLICY "Anyone can view active accessories" ON public.accessories
  FOR SELECT USING (active = true);

-- Accessory orders policies (users can view/create their own orders)
CREATE POLICY "Users can view own accessory orders" ON public.accessory_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own accessory orders" ON public.accessory_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Accessory order items policies (users can view items from their orders)
CREATE POLICY "Users can view own order items" ON public.accessory_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.accessory_orders 
      WHERE id = accessory_order_items.order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders" ON public.accessory_order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accessory_orders 
      WHERE id = accessory_order_items.order_id AND user_id = auth.uid()
    )
  );

-- 2FA codes policies (only service role can access)
CREATE POLICY "Service role only access to 2FA codes" ON public.twofa_codes
  FOR ALL USING (
    current_setting('role') = 'service_role' OR current_user = 'service_role'
  );

-- Org members policies (users can view their own memberships, admins can manage)
CREATE POLICY "Users can view own org memberships" ON public.org_members
  FOR SELECT USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_orgs_updated_at
  BEFORE UPDATE ON public.orgs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchises_updated_at
  BEFORE UPDATE ON public.franchises
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_org_members_updated_at
  BEFORE UPDATE ON public.org_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bike_models_updated_at
  BEFORE UPDATE ON public.bike_models
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bikes_updated_at
  BEFORE UPDATE ON public.bikes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rental_plans_updated_at
  BEFORE UPDATE ON public.rental_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rentals_updated_at
  BEFORE UPDATE ON public.rentals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accessories_updated_at
  BEFORE UPDATE ON public.accessories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accessory_orders_updated_at
  BEFORE UPDATE ON public.accessory_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();