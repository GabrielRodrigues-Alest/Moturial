-- Migration V3: Create motorcycles table
-- Author: Moturial Team
-- Description: Motorcycle fleet management table

-- Create motorcycles table
CREATE TABLE motorcycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    engine VARCHAR(50) NOT NULL,
    fuel VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    color VARCHAR(50) NOT NULL,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE')),
    location VARCHAR(255),
    daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate > 0),
    mileage INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
    last_maintenance TIMESTAMP,
    next_maintenance TIMESTAMP,
    insurance_expiry TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_motorcycles_status ON motorcycles(status);
CREATE INDEX idx_motorcycles_type ON motorcycles(type);
CREATE INDEX idx_motorcycles_license_plate ON motorcycles(license_plate);
CREATE INDEX idx_motorcycles_location ON motorcycles(location);
CREATE INDEX idx_motorcycles_created_at ON motorcycles(created_at);
CREATE INDEX idx_motorcycles_next_maintenance ON motorcycles(next_maintenance) WHERE next_maintenance IS NOT NULL;

-- Create composite indexes for common queries
CREATE INDEX idx_motorcycles_status_location ON motorcycles(status, location);
CREATE INDEX idx_motorcycles_type_status ON motorcycles(type, status);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_motorcycles_updated_at
    BEFORE UPDATE ON motorcycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE motorcycles IS 'Motorcycle fleet inventory management';
COMMENT ON COLUMN motorcycles.id IS 'Primary key UUID';
COMMENT ON COLUMN motorcycles.name IS 'Motorcycle model name';
COMMENT ON COLUMN motorcycles.type IS 'Motorcycle type/category';
COMMENT ON COLUMN motorcycles.engine IS 'Engine specification';
COMMENT ON COLUMN motorcycles.fuel IS 'Fuel type';
COMMENT ON COLUMN motorcycles.year IS 'Manufacturing year';
COMMENT ON COLUMN motorcycles.color IS 'Motorcycle color';
COMMENT ON COLUMN motorcycles.license_plate IS 'License plate number (unique)';
COMMENT ON COLUMN motorcycles.status IS 'Current availability status';
COMMENT ON COLUMN motorcycles.location IS 'Current location/store';
COMMENT ON COLUMN motorcycles.daily_rate IS 'Daily rental rate in BRL';
COMMENT ON COLUMN motorcycles.mileage IS 'Current mileage in kilometers';
COMMENT ON COLUMN motorcycles.last_maintenance IS 'Last maintenance date';
COMMENT ON COLUMN motorcycles.next_maintenance IS 'Next scheduled maintenance date';
COMMENT ON COLUMN motorcycles.insurance_expiry IS 'Insurance expiration date';
COMMENT ON COLUMN motorcycles.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN motorcycles.updated_at IS 'Last update timestamp';

-- Insert sample motorcycles
INSERT INTO motorcycles (name, type, engine, fuel, year, color, license_plate, location, daily_rate, mileage) VALUES
('Honda CG 160', 'Urban', '160cc', 'Gasolina', 2023, 'Vermelha', 'ABC-1234', 'São Paulo - Centro', 45.00, 5000),
('Honda Bros 160', 'Adventure', '160cc', 'Gasolina', 2022, 'Preta', 'DEF-5678', 'São Paulo - Centro', 55.00, 8000),
('Yamaha Fazer 250', 'Sport', '250cc', 'Gasolina', 2023, 'Azul', 'GHI-9012', 'Rio de Janeiro - Copacabana', 65.00, 3000);
