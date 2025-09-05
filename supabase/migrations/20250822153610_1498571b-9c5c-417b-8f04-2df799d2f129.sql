-- 003_seed.sql: Insert seed data for motorcycle rental platform

-- Create Holding company
INSERT INTO public.orgs (id, name, document_id)
VALUES ('11111111-1111-1111-1111-111111111111', 'Holding Motos', '12.345.678/0001-90');

-- Create SP franchise
INSERT INTO public.franchises (id, org_id, name, state, city)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Franquia SP', 'SP', 'São Paulo');

-- Create Paulista store
INSERT INTO public.stores (id, franchise_id, name, address, city, state, zip_code, phone, active)
VALUES ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Loja Paulista', 'Rua Augusta, 1000', 'São Paulo', 'SP', '01305-000', '(11) 99999-9999', true);

-- Create Suzuki DR 160 bike model
INSERT INTO public.bike_models (id, org_id, brand, model, year, colors, specs, image_urls, active)
VALUES (
  '44444444-4444-4444-4444-444444444444', 
  '11111111-1111-1111-1111-111111111111', 
  'Suzuki', 
  'DR 160', 
  2024, 
  ARRAY['preta', 'vermelha', 'azul'], 
  '{"engine": "160cc", "fuel": "Flex", "transmission": "Manual", "weight": "135kg"}',
  ARRAY['/assets/suzuki-dr160-preta.jpg', '/assets/suzuki-dr160-vermelha.jpg', '/assets/suzuki-dr160-azul.jpg'],
  true
);

-- Create rental plans
INSERT INTO public.rental_plans (id, org_id, name, description, duration_type, duration_qty, base_price_cents, deposit_cents, active)
VALUES 
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Diário', 'Aluguel por dia', 'day', 1, 9900, 20000, true),
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Mensal', 'Aluguel por mês', 'month', 1, 129900, 50000, true),
  ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Anual', 'Aluguel por ano', 'year', 1, 1399900, 100000, true);

-- Create sample bikes in the store
INSERT INTO public.bikes (id, store_id, bike_model_id, color, plate, vin, status, odometer)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'preta', 'ABC-1234', 'VIN001', 'available', 1500),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'vermelha', 'DEF-5678', 'VIN002', 'available', 800),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'azul', 'GHI-9012', 'VIN003', 'available', 2200);

-- Create sample accessories
INSERT INTO public.accessories (id, org_id, name, description, price_cents, stock, category, active)
VALUES 
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'Capacete Fechado', 'Capacete de segurança fechado', 15000, 50, 'safety', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'Luvas de Proteção', 'Luvas para pilotagem', 4500, 30, 'safety', true),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'Baú Traseiro', 'Baú para transporte de objetos', 25000, 20, 'storage', true);