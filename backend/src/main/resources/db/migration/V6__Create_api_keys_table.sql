-- Migration V6: Create API keys table
-- Author: Moturial Team
-- Description: API key management for admin authentication

-- Create api_keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'REVOKED')),
    permissions TEXT[], -- Array of permissions
    last_used TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_role ON api_keys(role);
CREATE INDEX idx_api_keys_status ON api_keys(status);
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_api_keys_last_used ON api_keys(last_used) WHERE last_used IS NOT NULL;

-- Create composite indexes for common queries
CREATE INDEX idx_api_keys_status_role ON api_keys(status, role);
CREATE INDEX idx_api_keys_user_status ON api_keys(user_id, status);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE api_keys IS 'API keys for admin system authentication';
COMMENT ON COLUMN api_keys.id IS 'Primary key UUID';
COMMENT ON COLUMN api_keys.key_hash IS 'Hashed API key (unique)';
COMMENT ON COLUMN api_keys.name IS 'Human-readable key name';
COMMENT ON COLUMN api_keys.description IS 'Key description/purpose';
COMMENT ON COLUMN api_keys.user_id IS 'Associated user (optional)';
COMMENT ON COLUMN api_keys.role IS 'API key role (ADMIN, STAFF)';
COMMENT ON COLUMN api_keys.status IS 'Key status';
COMMENT ON COLUMN api_keys.permissions IS 'Array of specific permissions';
COMMENT ON COLUMN api_keys.last_used IS 'Last usage timestamp';
COMMENT ON COLUMN api_keys.expires_at IS 'Key expiration timestamp';
COMMENT ON COLUMN api_keys.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN api_keys.updated_at IS 'Last update timestamp';

-- Insert default admin API key
INSERT INTO api_keys (key_hash, name, description, role, permissions) VALUES
('$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- hash of 'admin-key-123'
 'Default Admin Key',
 'Default API key for admin operations',
 'ADMIN',
 ARRAY['users:read', 'users:write', 'motorcycles:read', 'motorcycles:write', 'rentals:read', 'rentals:write', 'stores:read', 'stores:write', 'reports:read']);
