-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS rent_requests;
DROP TABLE IF EXISTS enquiries;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS property_panorama_images;
DROP TABLE IF EXISTS property_images;
DROP TABLE IF EXISTS property_amenities;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS builders; -- Drop incorrect table if exists
DROP TABLE IF EXISTS users;

-- Users Table (Handles both Users and Builders)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(255),
    role VARCHAR(50), -- user, builder, admin
    status VARCHAR(50), -- active, pending_verification
    
    -- Builder Specific Fields
    company_name VARCHAR(255),
    owner_name VARCHAR(255),
    gst_number VARCHAR(255),
    address VARCHAR(1000),
    verification_status VARCHAR(50) DEFAULT 'PENDING',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties Table
CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    builder_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Links to Users table
    title VARCHAR(255) NOT NULL,
    description VARCHAR(5000),
    property_type VARCHAR(50), -- RESIDENTIAL, COMMERCIAL
    purpose VARCHAR(50), -- BUY, RENT
    price DECIMAL(19, 2),
    rent_amount DECIMAL(19, 2),
    deposit_amount DECIMAL(19, 2),
    area_sqft INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    possession_year INTEGER,
    construction_status VARCHAR(50), -- UNDER_CONSTRUCTION, READY
    availability_status VARCHAR(50) DEFAULT 'AVAILABLE',
    city VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    google_map_link TEXT,
    brochure_url TEXT,
    virtual_tour_link TEXT,
    legal_document_path TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    panorama_image_path TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property Amenities (ElementCollection as SET)
CREATE TABLE property_amenities (
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity VARCHAR(255) NOT NULL,
    PRIMARY KEY (property_id, amenity) -- Composite PK
);

-- Property Images (ElementCollection with Order)
CREATE TABLE property_images (
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT,
    image_order INTEGER NOT NULL,
    PRIMARY KEY (property_id, image_order) -- Composite PK
);

-- Property Panorama Images (ElementCollection with Order)
CREATE TABLE property_panorama_images (
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    panorama_image_url TEXT,
    image_order INTEGER NOT NULL,
    PRIMARY KEY (property_id, image_order) -- Composite PK
);

-- Enquiries Table
CREATE TABLE enquiries (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message VARCHAR(1000),
    enquiry_type VARCHAR(50), -- BUY, RENT
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rent Requests Table
CREATE TABLE rent_requests (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    monthly_rent DECIMAL(19, 2),
    deposit DECIMAL(19, 2),
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(id) ON DELETE SET NULL,
    builder_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL, -- Payer
    amount DECIMAL(19, 2),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) -- SUCCESS, FAILED, PENDING
);

-- Complaints Table
CREATE TABLE complaints (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, -- Complainant
    title VARCHAR(255),
    description VARCHAR(5000),
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, RESOLVED, CLOSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Withdrawals Table (For Builders)
CREATE TABLE withdrawals (
    id BIGSERIAL PRIMARY KEY,
    builder_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(19, 2),
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);
