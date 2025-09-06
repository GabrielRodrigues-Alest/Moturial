-- Migration V4: Create rentals table
-- Author: Moturial Team
-- Description: Rental management table with payment integration

-- Create rentals table
CREATE TABLE rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    motorcycle_id UUID NOT NULL REFERENCES motorcycles(id) ON DELETE RESTRICT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    actual_return_date TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'OVERDUE', 'REFUNDED')),
    daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate > 0),
    total_days INTEGER NOT NULL CHECK (total_days > 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
    deposit_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
    late_fee DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (late_fee >= 0),
    damage_fee DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (damage_fee >= 0),
    pickup_location VARCHAR(255) NOT NULL,
    return_location VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_rental_dates CHECK (end_date > start_date),
    CONSTRAINT chk_actual_return CHECK (actual_return_date IS NULL OR actual_return_date >= start_date)
);

-- Create indexes for performance
CREATE INDEX idx_rentals_user_id ON rentals(user_id);
CREATE INDEX idx_rentals_motorcycle_id ON rentals(motorcycle_id);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_payment_status ON rentals(payment_status);
CREATE INDEX idx_rentals_start_date ON rentals(start_date);
CREATE INDEX idx_rentals_end_date ON rentals(end_date);
CREATE INDEX idx_rentals_created_at ON rentals(created_at);

-- Create composite indexes for common queries
CREATE INDEX idx_rentals_user_status ON rentals(user_id, status);
CREATE INDEX idx_rentals_motorcycle_status ON rentals(motorcycle_id, status);
CREATE INDEX idx_rentals_status_payment ON rentals(status, payment_status);
CREATE INDEX idx_rentals_dates_status ON rentals(start_date, end_date, status);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_rentals_updated_at
    BEFORE UPDATE ON rentals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE rentals IS 'Motorcycle rental transactions';
COMMENT ON COLUMN rentals.id IS 'Primary key UUID';
COMMENT ON COLUMN rentals.user_id IS 'Reference to renting user';
COMMENT ON COLUMN rentals.motorcycle_id IS 'Reference to rented motorcycle';
COMMENT ON COLUMN rentals.start_date IS 'Rental start date and time';
COMMENT ON COLUMN rentals.end_date IS 'Planned rental end date and time';
COMMENT ON COLUMN rentals.actual_return_date IS 'Actual return date and time';
COMMENT ON COLUMN rentals.status IS 'Current rental status';
COMMENT ON COLUMN rentals.payment_status IS 'Payment status';
COMMENT ON COLUMN rentals.daily_rate IS 'Daily rental rate at time of booking';
COMMENT ON COLUMN rentals.total_days IS 'Total rental days';
COMMENT ON COLUMN rentals.total_amount IS 'Total rental amount';
COMMENT ON COLUMN rentals.deposit_amount IS 'Security deposit amount';
COMMENT ON COLUMN rentals.late_fee IS 'Late return fee';
COMMENT ON COLUMN rentals.damage_fee IS 'Damage assessment fee';
COMMENT ON COLUMN rentals.pickup_location IS 'Motorcycle pickup location';
COMMENT ON COLUMN rentals.return_location IS 'Motorcycle return location';
COMMENT ON COLUMN rentals.notes IS 'Additional rental notes';
COMMENT ON COLUMN rentals.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN rentals.updated_at IS 'Last update timestamp';
