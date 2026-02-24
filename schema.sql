
-- SpeedRide 2026 | Production Database Schema
-- Compatible with PostgreSQL or MySQL

-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('RIDER', 'DRIVER', 'ADMIN')),
    avatar TEXT,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    balance DECIMAL(15, 2) DEFAULT 0.0,
    is_online BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    vehicle_type VARCHAR(20) CHECK (vehicle_type IN ('BUS', 'TRUCK', 'ECONOMY', 'COMFORT', 'LUXURY', 'TRICYCLE')),
    vehicle_model VARCHAR(100),
    plate_number VARCHAR(20),
    license_doc TEXT, -- Base64 or Image URL
    nin_doc TEXT,     -- Base64 or Image URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Rides Table
CREATE TABLE rides (
    id VARCHAR(50) PRIMARY KEY,
    rider_id VARCHAR(50) REFERENCES users(id),
    driver_id VARCHAR(50) REFERENCES users(id),
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    fare DECIMAL(12, 2) NOT NULL,
    distance DECIMAL(8, 2) NOT NULL, -- in KM
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED' 
        CHECK (status IN ('REQUESTED', 'ACCEPTED', 'ARRIVING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    vehicle_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Transactions Table (Optional but recommended)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id),
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Admin Seed
-- Password hash would be hashed in production (e.g., bcrypt)
INSERT INTO users (id, name, email, phone, password_hash, role, is_verified) 
VALUES ('admin_01', 'SpeedAdmin', 'admin', '08000000000', 'admin123', 'ADMIN', TRUE);

-- Create Indexes for performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_rides_rider ON rides(rider_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
