-- Migration V5: Create stores table
-- Author: Moturial Team
-- Description: Store/location management table

-- Create stores table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    manager_name VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    capacity INTEGER NOT NULL DEFAULT 0 CHECK (capacity >= 0),
    current_inventory INTEGER NOT NULL DEFAULT 0 CHECK (current_inventory >= 0),
    operating_hours TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_inventory_capacity CHECK (current_inventory <= capacity)
);

-- Create indexes for performance
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_stores_city ON stores(city);
CREATE INDEX idx_stores_state ON stores(state);
CREATE INDEX idx_stores_zip_code ON stores(zip_code);
CREATE INDEX idx_stores_created_at ON stores(created_at);

-- Create spatial index for location-based queries
CREATE INDEX idx_stores_location ON stores(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create composite indexes for common queries
CREATE INDEX idx_stores_city_status ON stores(city, status);
CREATE INDEX idx_stores_state_city ON stores(state, city);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE stores IS 'Physical store locations for motorcycle rentals';
COMMENT ON COLUMN stores.id IS 'Primary key UUID';
COMMENT ON COLUMN stores.name IS 'Store name';
COMMENT ON COLUMN stores.address IS 'Full street address';
COMMENT ON COLUMN stores.city IS 'City name';
COMMENT ON COLUMN stores.state IS 'State/province';
COMMENT ON COLUMN stores.zip_code IS 'Postal/ZIP code';
COMMENT ON COLUMN stores.phone IS 'Store phone number';
COMMENT ON COLUMN stores.email IS 'Store email address';
COMMENT ON COLUMN stores.manager_name IS 'Store manager name';
COMMENT ON COLUMN stores.status IS 'Store operational status';
COMMENT ON COLUMN stores.capacity IS 'Maximum motorcycle capacity';
COMMENT ON COLUMN stores.current_inventory IS 'Current motorcycle count';
COMMENT ON COLUMN stores.operating_hours IS 'Store operating hours (JSON format)';
COMMENT ON COLUMN stores.latitude IS 'Geographic latitude';
COMMENT ON COLUMN stores.longitude IS 'Geographic longitude';
COMMENT ON COLUMN stores.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN stores.updated_at IS 'Last update timestamp';

-- Insert sample stores
INSERT INTO stores (name, address, city, state, zip_code, phone, email, manager_name, capacity, current_inventory, latitude, longitude) VALUES
('Moturial São Paulo Centro', 'Rua Augusta, 123 - Centro', 'São Paulo', 'SP', '01305-000', '(11) 3333-4444', 'centro@moturial.com', 'Carlos Silva', 50, 25, -23.5505, -46.6333),
('Moturial Rio Copacabana', 'Av. Atlântica, 456 - Copacabana', 'Rio de Janeiro', 'RJ', '22070-000', '(21) 2222-3333', 'copacabana@moturial.com', 'Ana Santos', 30, 15, -22.9068, -43.1729),
('Moturial Belo Horizonte', 'Av. Afonso Pena, 789 - Centro', 'Belo Horizonte', 'MG', '30112-000', '(31) 1111-2222', 'bh@moturial.com', 'João Oliveira', 40, 20, -19.9167, -43.9345);
