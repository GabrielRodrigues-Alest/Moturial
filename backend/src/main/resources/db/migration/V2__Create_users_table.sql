-- Migration V2: Create users table
-- Author: Moturial Team
-- Description: User management table with roles and authentication

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'USER')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login) WHERE last_login IS NOT NULL;

-- Create composite indexes for common queries
CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_users_email_status ON users(email, status);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE users IS 'System users with role-based access control';
COMMENT ON COLUMN users.id IS 'Primary key UUID';
COMMENT ON COLUMN users.name IS 'User full name';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.phone IS 'User phone number';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.role IS 'User role (ADMIN, STAFF, USER)';
COMMENT ON COLUMN users.status IS 'User account status';
COMMENT ON COLUMN users.email_verified IS 'Email verification status';
COMMENT ON COLUMN users.phone_verified IS 'Phone verification status';
COMMENT ON COLUMN users.last_login IS 'Last login timestamp';
COMMENT ON COLUMN users.created_at IS 'User creation timestamp';
COMMENT ON COLUMN users.updated_at IS 'Last update timestamp';

-- Insert default admin user
INSERT INTO users (name, email, password_hash, role, status, email_verified) 
VALUES (
    'Admin User',
    'admin@moturial.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'ADMIN',
    'ACTIVE',
    TRUE
);
