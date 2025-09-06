-- Migration V1: Create payments table
-- Author: Moturial Team
-- Description: Initial payment table creation with proper indexes and constraints

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('CARD', 'PIX', 'BOLETO')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED')),
    installments INTEGER NOT NULL CHECK (installments >= 1 AND installments <= 12),
    description VARCHAR(500),
    metadata TEXT,
    error_message VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_payment_external_id ON payments(external_id);
CREATE INDEX idx_payment_status ON payments(status);
CREATE INDEX idx_payment_created_at ON payments(created_at);
CREATE INDEX idx_payment_user_id ON payments(user_id);
CREATE INDEX idx_payment_method ON payments(payment_method);
CREATE INDEX idx_payment_processed_at ON payments(processed_at) WHERE processed_at IS NOT NULL;

-- Create composite indexes for common queries
CREATE INDEX idx_payment_user_status ON payments(user_id, status);
CREATE INDEX idx_payment_status_created ON payments(status, created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE payments IS 'Payment transactions table with full audit trail';
COMMENT ON COLUMN payments.id IS 'Primary key UUID';
COMMENT ON COLUMN payments.external_id IS 'External payment provider ID (Stripe, etc.)';
COMMENT ON COLUMN payments.user_id IS 'User identifier who initiated the payment';
COMMENT ON COLUMN payments.amount IS 'Payment amount in cents/centavos';
COMMENT ON COLUMN payments.currency IS 'ISO 4217 currency code (BRL, USD, etc.)';
COMMENT ON COLUMN payments.payment_method IS 'Payment method type';
COMMENT ON COLUMN payments.status IS 'Current payment status';
COMMENT ON COLUMN payments.installments IS 'Number of installments (1-12)';
COMMENT ON COLUMN payments.description IS 'Payment description';
COMMENT ON COLUMN payments.metadata IS 'Additional payment metadata as JSON';
COMMENT ON COLUMN payments.error_message IS 'Error message if payment failed';
COMMENT ON COLUMN payments.created_at IS 'Payment creation timestamp';
COMMENT ON COLUMN payments.updated_at IS 'Last update timestamp';
COMMENT ON COLUMN payments.processed_at IS 'Payment processing completion timestamp';
