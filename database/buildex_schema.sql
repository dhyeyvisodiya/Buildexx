-- BuildEx Database Schema for NeonDB
-- Run this script in your NeonDB SQL Editor to initialize the database

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS rent_subscriptions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS rent_requests CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (for all user types: user, builder, admin)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'builder', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'blocked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('Buy', 'Rent')),
    price DECIMAL(15, 2),
    rent_amount DECIMAL(15, 2),
    min_rent_amount DECIMAL(15, 2),  -- Minimum amount for rent payment (security deposit)
    area_sqft INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    city VARCHAR(100),
    area VARCHAR(100),  -- locality
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    map_link VARCHAR(500),
    possession_year VARCHAR(50),
    construction_status VARCHAR(50),
    description TEXT,
    amenities TEXT[],
    images TEXT[],
    brochure_url TEXT,
    google_map_link VARCHAR(500),
    virtual_tour_link VARCHAR(500),
    availability_status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (availability_status IN ('AVAILABLE', 'BOOKED', 'SOLD', 'RENTED')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'blocked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table for all transactions
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    builder_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('BUY', 'RENT', 'RENT_MONTHLY')),
    amount DECIMAL(15, 2) NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rent Subscriptions table for monthly rent tracking
CREATE TABLE rent_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    monthly_rent DECIMAL(15, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_payment_due DATE NOT NULL,
    grace_period_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT true,
    last_payment_id INTEGER REFERENCES payments(id),
    last_payment_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'overdue', 'suspended', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- Enquiries table
CREATE TABLE enquiries (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    message TEXT,
    enquiry_type VARCHAR(20) DEFAULT 'buy' CHECK (enquiry_type IN ('buy', 'rent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rent Requests table
CREATE TABLE rent_requests (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    builder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    move_in_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed')),
    rent_amount VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaints table
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    issue TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist table
CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_properties_builder ON properties(builder_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_enquiries_user ON enquiries(user_id);
CREATE INDEX idx_enquiries_builder ON enquiries(builder_id);
CREATE INDEX idx_rent_requests_user ON rent_requests(user_id);
CREATE INDEX idx_rent_requests_builder ON rent_requests(builder_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_property ON payments(property_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_rent_subscriptions_user ON rent_subscriptions(user_id);
CREATE INDEX idx_rent_subscriptions_property ON rent_subscriptions(property_id);
CREATE INDEX idx_rent_subscriptions_status ON rent_subscriptions(status);